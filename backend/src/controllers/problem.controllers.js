import {db} from '../libs/db.js';


export const createProblem = async (req, res) => {
    const {title, description, tags, difficulty, examples, constraints, hint, editorial, testCases, codeSnippets, referenceSolutions} = req.body;

    if(!req.user.role!== "ADMIN"){
        return res.status(401).json({
            success:false,
            error:"User is not an admin"
        })
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId =  getJudge0LanguageId(language);
            if(!languageId){
                return res.status(400).json({
                    success:false,
                    error:`Language ${language} is not supported`
                })
            }

            const submissions=testCases.map((input,output)=>({
                sourceCode:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,
            }))
            
            const submissionResults = await submitBatch(submissions); 
            
            const tokens = submissionResults.map((res)=>(res.token))

            const results = await poolBatchResults(tokens);

            for(let i=0;i<results.length;i++){
                if(results[i].status_id !== 3){
                    return res.status(400).json({
                        success:false,
                        error:`Test case ${i+1} failed`,
                        result:results[i]
                    })
                }
            }

            const newProblem = db.problem.create({
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
                userId:req.user.id,
            })
            return res.status(201).json({
                success:true,
                data:newProblem,
                message:"Problem created successfully"
            })
        }
    } catch (error) {
        
    }
}

export const getAllProblems = async (req, res) => {}

export const getProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {}

export const solvedProblemsByUser = async (req, res) => {}