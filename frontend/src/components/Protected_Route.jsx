import { Navigate } from "react-router-dom";

export default function Protected_Route({ children }){//take component as children
    if(!localStorage.getItem('login'))
    {
        alert("You must do login");
        return <Navigate to={"/login"} replace/>
    }
    return children;
}