export const getJudge0LanguageId = (language) => {
    const languageMap={
        "C++ (GCC 9.2.0)":54,
        "Java":62,
        "Javascript":63,
        "Python 3":71,
        "C":50,
    }

    return languageMap[language.toUpperCase()];
}


export const submitBatch = async (submissions) => {
     const {data}= await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions
     });

     return data;   
}


export const poolBatchResults = async (tokens) => {
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions.status_id;

        const isAllDone = results.every((result) => result.status_id !== 1 && result.status_id !== 2);

        if(isAllDone){
            return results;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }


}