import axios from "axios";
export const getJudge0LanguageId = (language) => {
    const languageMap={
        "C++":54,
        "JAVA":62,
        "JAVASCRIPT":63,
        "PYTHON":71,
        "C":50,
    }

    return languageMap[language.toUpperCase()];
}

export const getLanguageName = (id) => {
    const languageMap={
        54:"C++",
        62:"JAVA",
        63:"JAVASCRIPT",
        71:"PYTHON",
        50:"C",
    }

    return languageMap[id] || "Unknown";
}


export const submitBatch = async (submissions) => {
    try {
        console.log("submissions in submit", submissions);
        
         const {data}= await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
            submissions
         });
         console.log("batch submission", data);
         
         return data;   
    } catch (error) {
        console.error("Error in batch submission", error);
        throw new Error("Error in batch submission");
        
    }
}


export const poolBatchResults = async (tokens) => {
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;
        console.log(results, "results");
        

        const isAllDone = results.every((result) => (result.status.id !== 1 && result.status.id !== 2));

        if(isAllDone){
            console.log("All done", results);

            return results;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }


}

