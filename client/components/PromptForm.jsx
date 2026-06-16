import {useState} from "react";

function PromptForm(){
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");
    const handleGenerate = async () => {
        try{
            setLoading(true);
            setMessage("Ollama is loading your course..");
            const response = await fetch("http://localhost:5000/api/courses/generate",{
                method : "POST",
                headers: {
                    "Content-Type" :"body/json",
                },
                body: JSON.stringify({
                    topic : topic,
                    sender: "random_ass_name",
                }),
            });
            const result = await response.json();
            if(result.success){
                // then we got the proper response..
                setMessage(`Success !! Course created with ID : ${result.courseid}`);
            }

        }catch(error){
            console.log("Error in communicating with backend", error);

        }finally{
            setLoading(false);
        }
    }
    return (
        <div>
            <h2>What do you want to learn today ?</h2>
            <input type = "text" value = {topic} onChange = {(e) => setTopic(e.target.value)} placeholder = "e.g., React Hooks"></input>
            <button onClick = {handleGenerate}>{loading ? "Generating.." : "Generate Course"}</button>
            {message && <p>{message}</p>}
        </div>
    )
}
export default PromptForm;