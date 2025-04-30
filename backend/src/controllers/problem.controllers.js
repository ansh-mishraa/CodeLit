import {db} from '../libs/db.js';
import {getJudge0LanguageId, poolBatchResults, submitBatch} from '../utils/judge0.js';

export const createProblem = async (req, res) => {
    const {title, description, tags, difficulty, examples, constraints, hint, editorial, testCases, codeSnippets, referenceSolutions} = req.body;
    console.log(req.user, "user");
    
    if(req.user.role !== "ADMIN"){
        return res.status(401).json({
            success:false,
            error:"User is not an admin"
        })
    }

    try {
        // "referenceSolutions": {
        // "JAVASCRIPT": "const fs = require('fs');\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(a + b);",
        // "PYTHON": "import sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(a + b)",
        // "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
    
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId =  getJudge0LanguageId(language);
            console.log("making submissions", language);
            
            if(!languageId){
                return res.status(400).json({
                    success:false,
                    error:`Language ${language} is not supported`
                })
            }
            
            //how the test cases will look like in the judge0

                // "testcases": [
                //     {
                //         "input": "100 200",
                //         "output": "300"
                //     },
                //     {
                //         "input": "-500 -600",
                //         "output": "-1100"
                //     },
                //     {
                //         "input": "0 0",
                //         "output": "0"
                //     }
                // ],
            const submissions=testCases.map(({input,output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,
            }))
             console.log(submissions, "submissions");

             //How the code will look like in the judge0
             
                //  const fs = require('fs');
                
                //  function addTwoNumbers(a, b) {
                //     return a + b;
                //  }

                //     const input = fs.readFileSync(0, 'utf-8').trim();
                //     const [a, b] = input.split(' ').map(Number);
                //     console.log(addTwoNumbers(a, b));
                

            
            const submissionResults = await submitBatch(submissions); 
            
            const tokens = submissionResults.map((res)=>(res.token))

            const results = await poolBatchResults(tokens);

            for(let i=0;i<results.length;i++){
                if(results[i].status.id !== 3){
                    return res.status(400).json({
                        success:false,
                        error:`Test case ${i+1} failed`,
                        result:results[i]
                    })
                }
            }

        }
        const newProblem = await db.problem.create({
            data: {
              title,
              description,
              tags,
              difficulty,
              examples,
              constraints,
              hint,
              editorial,
              testCases,
              codeSnippets,
              referenceSolutions,
              userId: req.user.id,
            }
          });
          

        if(!newProblem){
            return res.status(400).json({
                success:false,
                error:"Error in creating problem"
            })
        }
        return res.status(201).json({
            success:true,
            data:newProblem,
            message:"Problem created successfully"
        })
    } catch (error) {
        console.error("Error in creating problem", error);
        return res.status(500).json({
            success:false,
            error:"Error in creating problem"
        })
    }
}

export const getAllProblems = async (req, res) => {}

export const getProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {}

export const solvedProblemsByUser = async (req, res) => {}