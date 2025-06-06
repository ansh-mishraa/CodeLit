import { getLanguageName, poolBatchResults, submitBatch } from "../utils/judge0.js";
import {db} from "../libs/db.js";
export const executeCode = async (req, res) => {
    const {source_code, language_id, stdin, expected_outputs, problem_id} = req.body;
    const userId = req.user.id;
    try {
        //validate test cases
        if (!Array.isArray(stdin)|| stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
            return res.status(400).json({message: "Invalid test cases"});
        }

        //Prepare each test case for batch submission in judge0
        const submissions = stdin.map((input , index) => {
            return {
                source_code,
                language_id,
                stdin: input,
                expected_output: expected_outputs[index],
                problem_id,
                userId,
                
            };
        });
        //Send the batch submission to judge0

        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        //Pool the results for the batch submission
        const results = await poolBatchResults(tokens);

        console.log("results----------------------", results);
        
        let allPassed = true;

        const detailedResults = results.map((result,index)=>{
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[index].trim();
            if(stdout !== expected_output){
                allPassed = false;
            }
            return {
                testCase: index + 1,
                passed: stdout === expected_output,
                stdOut: stdout,
                expectedOutput: expected_output,
                strdErr: result.stderr || null,
                compiledOutput: result.compiled_output || null,
                status: result.status.description,
                timeTaken: result.time ? `${result.time} sec` : undefined,
                memoryUsed: result.memory? `${result.memory} KB` : undefined,  
            };
        });

        console.log("detailedResults", detailedResults);
        
        //saving as an overall submission
        const submission = await db.submission.create({
            data:{
                userId,
                problemId:problem_id,
                sourceCode:source_code,
                language:getLanguageName(language_id),
                stdin:stdin.join("\n"),
                stdout:JSON.stringify(detailedResults.map((result) => result.stdOut)),
                stderr:detailedResults.some((result) => result.strdErr) ? JSON.stringify(detailedResults.map((result) => result.strdErr)) : null,
                compiledOutput:detailedResults.some((result) => result.compiled_output) ? JSON.stringify(detailedResults.map((result) => result.compiled_output)) : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memoryUsed:detailedResults.some((result) => result.memoryUsed) ? JSON.stringify(detailedResults.map((result) => result.memoryUsed)) : null,
                timeTaken:detailedResults.some((result) => result.timeTaken) ? JSON.stringify(detailedResults.map((result) => result.timeTaken)) : null,
            }
        })
        //mark the problem solved for the user
        if(allPassed){
            await db.problemSolved.upsert({
                where:{
                    userId_problemId:{
                        userId,
                        problemId:problem_id,
                    }
                },
                update:{},
                create:{
                    userId,
                    problemId:problem_id,
                }
            })
        }

        //store each test case data
        const testCaseResults = detailedResults.map((result) => {
            return{
                submissionId:submission.id,
                testCase:result.testCase,
                passed:result.passed,
                stdOut:result.stdOut,
                expectedOutput:result.expectedOutput,
                stdErr:result.stderr,
                compiledOutput:result.compiled_output,
                status:result.status,
                timeTaken:result.timeTaken,
                memoryUsed:result.memoryUsed,
            }
        })

        await db.TestCaseResult.createMany({
            data:testCaseResults
        })

        const submissionWithTestCaseResults = await db.submission.findUnique({
            where:{id:submission.id},
            include:{testCaseResults:true}
        })
        console.log("submissionWithTestCaseResults", submissionWithTestCaseResults);


        res.status(200).json({
            message: "Code executed successfully",
            submission: submissionWithTestCaseResults
        });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}


  