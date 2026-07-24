import { useEffect, useState } from "react";
import "../style/signup_login.css";
import { Link, useNavigate } from "react-router-dom";

function SignUp(){
    const [userData,setUserData]=useState({});
    const [mode,setMode]=useState(localStorage.getItem("mode") || "Light");
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('login'))//for not goto the login page again with 'login' name
        {
            alert("You account was created");
            navigate("/doctors");
        }

        const toggle_mode = ()=>{
            setMode(localStorage.getItem("mode"))
        }

        window.addEventListener("mode_change",toggle_mode);

        return ()=>{
            window.removeEventListener("mode_change",toggle_mode);
        }
    },[]);

    async function handleSignUp(event){
        event.preventDefault();
        console.log(userData);

        let result = await fetch("http://localhost:3533/signup",{
            method:'POST',
            body:JSON.stringify(userData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        result = await result.json();

        if(result.success)
        { 
            console.log("new data entered");
            // console.log(result.token);
            document.cookie=`token=${result.token}`;//get token from api and store it into the cookie for some time
            // if we delete this then move on page but not show data and not store cookie becuse of backend
            
            localStorage.setItem('login',userData.email);//for store email into localStorage(browser) until logout
            navigate("/login");
        }
    }

    return(
        <form onSubmit={handleSignUp} className={`${mode === "Dark"?"dark":""}`}>
            <h3>Sing Up</h3>
            <label className={`${mode === "Dark"?"dark":""}`}>Username</label>
            <input onChange={(event)=>setUserData({...userData,username:event.target.value})}
            className={`${mode === "Dark"?"dark":""}`} type="text" placeholder="Enter Username" required></input>

            <label className={`${mode === "Dark"?"dark":""}`}>Email</label>
            <input onChange={(event)=>setUserData({...userData,email:event.target.value})}
            className={`${mode === "Dark"?"dark":""}`} type="email" placeholder="Enter Email" required></input>

            <label className={`${mode === "Dark"?"dark":""}`}>Address</label>
            <input onChange={(event)=>setUserData({...userData,address:event.target.value})}
            className={`${mode === "Dark"?"dark":""}`} type="text" placeholder="Enter Address" required></input>

            <label className={`${mode === "Dark"?"dark":""}`} >Password</label>
            <input onChange={(event)=>setUserData({...userData,password:event.target.value})}
            className={`${mode === "Dark"?"dark":""}`} type="password" placeholder="Enter Password" required></input>

            <button  className="signupb">SignUp</button>

            <p><b>Already have an account? <Link to={"/login"} replace>Login</Link> here.</b></p>
        </form>
    )
}

export default SignUp;