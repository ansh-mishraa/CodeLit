import { db } from "../libs/db.js";


export const getAllSubmissions = async (req, res) => {
    const userId = req.user.id;
    try {
        const submissions= await db.submission.findMany(
            {
                where: {
                    userId
                }
            }

        );
        return res.status(200).json({
            success: true,
            submissions,
            message: "Submissions retrieved successfully"
        });
    } catch (error) {
        console.error("Error in getting submissions", error);
        return res.status(500).json({
            success: false,
            error: "Error in getting submissions"
        });
    }
} 

export const getSubmissionByProblemId = async (req, res) => {
    const userId = req.user.id;
    const {problemId} = req.params;
    try {
        const submissions= await db.submission.findMany(
            {
                where: {
                    userId,
                    problemId
                }
            }

        );
        return res.status(200).json({
            success: true,
            submissions,
            message: "Submissions by problem retrieved successfully"
        });
    } catch (error) {
        console.error("Error in getting submissions by problem", error);
        return res.status(500).json({
            success: false,
            error: "Error in getting submissions"
        });
    }
}

export const countSubmissionsByProblemId = async (req, res) => {
    const problemId = req.params.problemId;
    try {
        const submissionsCount= await db.submission.count({
            where: {
                problemId
            }
        });
        return res.status(200).json({
            success: true,
            submissionsCount,
            message: "Count of Submissions by problem retrieved successfully"
        });
    } catch (error) {
        console.error("Error in getting submissions by problem", error);
        return res.status(500).json({
            success: false,
            error: "Error in getting submissions"
        });
    }
}