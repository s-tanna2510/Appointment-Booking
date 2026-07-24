import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

export default function Forgetpassword(){
    const [passwordData, setPasswordData] = useState({});
    const navigate = useNavigate();
    const [mode, setMode] = useState(localStorage.getItem("mode")||"Light");

    useEffect(()=>{

        const toggle_mode = () => { 
          setMode(localStorage.getItem("mode"))  
        };

        window.addEventListener("mode-change", toggle_mode);
        return () => {
          window.removeEventListener("mode-change", toggle_mode);
        };
    });

    async function handleForgetpassword(event){
        event.preventDefault(); 

        if(passwordData.password != passwordData.confirmpassword)
        {
            return alert("You entered Passwords don't match....Ty Again....");
        }
        
        let result = await fetch("http://localhost:3533/forget_password",{
            method : "PUT",
            body : JSON.stringify(passwordData),
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials : "include"
        })
        result = await result.json();
        console.log(result);
        

        if(result.success)
        {
            alert("Password Updated successfully");
            console.log(passwordData);
            navigate("/login");
        }
        else
        {
            alert("Email doesn't Exists....Enter correct email");
        }
    }

    return(
        <form onSubmit={handleForgetpassword} className={`${mode === "Dark"?"dark":""}`}>
            <h3>Forget Password</h3>
            <label className={`${mode === "Dark"?"dark":""}`}>Email</label>
            <input onChange={(event)=>setPasswordData({...passwordData,email:event.target.value})} 
                className={`${mode === "Dark"?"dark":""}`} type="email" placeholder="Enter Email" required></input>

            <label className={`${mode === "Dark"?"dark":""}`}> Create New Password</label>
            <input onChange={(event)=>setPasswordData({...passwordData,password:event.target.value})}
            className={`${mode === "Dark"?"dark":""}`} type="password" placeholder="Enter New Password" required></input>

            <label className={`${mode === "Dark"?"dark":""}`}>Confirm Password</label>
            <input onChange={(event)=>setPasswordData({...passwordData,confirmpassword:event.target.value})}
            className={`${mode === "Dark"?"dark":""}`} type="password" placeholder="Confirm Password" required></input>

            <button className="signupb">Update Password</button>

            <p><b>Don't have account? <Link to={"/Signup"} replace>Signup</Link> here.</b></p>
        </form>
    )
}