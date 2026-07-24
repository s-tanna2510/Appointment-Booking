import { useEffect, useState } from "react";
import "../style/signup_login.css";
import { Link, useNavigate } from "react-router-dom";

function Login(){
    const [userData,setUserData]=useState({});
    const [mode, setMode] = useState(localStorage.getItem("mode")||"Light");
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('login'))//for not goto the login page again with 'login' name
        {//If token expires or cookie is deleted, user is still considered “logged in” because of userData.email

            alert("You are already logged in");
            navigate("/doctors");
        }

        const toggle_mode = () => { 
          setMode(localStorage.getItem("mode"))  
        };

        window.addEventListener("mode-change", toggle_mode);
        return () => {
          window.removeEventListener("mode-change", toggle_mode);
        };

    },[]);

    async function handleLogin(event){
        event.preventDefault();// stop page refresh   
         console.log(userData);

        let result = await fetch("http://localhost:3533/login",{
            method:"POST",
            body:JSON.stringify(userData),
            headers:{
                'Content-Type':'application/json'
            },
            credentials : "include"
        })
        result = await result.json();
        if(result.success)
        {
            console.log("data matched");
            // document.cookie=`token=${result.token}`;//get token from api and store it into the cookie for some time
           // if we delete this then move on page but not show data and not store cookie becuse of backend
           // this not secure 
           
            localStorage.setItem('login',userData.email);//for store email into localStorage(browser) until logout--store login flag in browser
            window.dispatchEvent(new Event('localstorage-change'));//for showing menu--
            // Menu updates instantly--No refresh needed--Creates a custom event--Browser does NOT provide this event by default
            navigate("/doctors");
        }
        else
        {
            alert("Invalid Email or Password");
        }
    }


    

    return(
        <form onSubmit={handleLogin} className={`${mode === "Dark"?"dark":""}`}>
            <h3>Login</h3>
            <label className={`${mode === "Dark"?"dark":""}`}>Email</label>
            <input className={`${mode === "Dark"?"dark":""}`} onChange={(event)=>setUserData({...userData,email:event.target.value})} 
                type="email" placeholder="Enter Email" required></input>

            <label className={`${mode === "Dark"?"dark":""}`}>Password</label>
            <input className={`${mode === "Dark"?"dark":""}`} onChange={(event)=>setUserData({...userData,password:event.target.value})}
            type="password" placeholder="Enter Password" required></input>

            <Link to="/forget_password" className="forget_link">Forget Password?</Link>

            <button className="signupb">Login</button>

            <p><b>Don't have account? <Link to={"/Signup"} replace>Signup</Link> here.</b></p>
        </form>
    )
}

export default Login;