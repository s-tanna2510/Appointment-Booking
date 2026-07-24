import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style/App.css'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/SingUp'
import Login from './components/Login'
import Appointments from './components/appointments'
import Book_Appointment from './components/Book_Appointment'
import Menu from './components/menu'
import Update_Appointment from './components/Update_Appointment'
import Display_doctor from './components/Display_doctor'
import Protected_Route from './components/Protected_Route'
import Mainpage from './components/Mainpage'
import Forgetpassword from './components/Forgetpassword'

function App() {
  const [count, setCount] = useState(0)
  useEffect(()=>{
      async function checkauth(){
        try{
            let result = await fetch("http://localhost:3533/verify", {
            credentials: "include"
            });
            result = await result.json();

            console.log("login check");
                
            if (!result.success || result.status === 401) {
              localStorage.removeItem("login");
              window.dispatchEvent(new Event("localstorage-change"));
              navigate("/login");
            }
          }
          catch(error){
              console.log("Auth check failed");
          }
        }
      checkauth();
      const interval = setInterval(checkauth,500000);
      return () => clearInterval(interval);
  },[]);

  return (
    <>
      {/* <h3> Main </h3> */}
      <Menu/>
      <Routes>
        <Route path="/" element={  <Mainpage/>  }>    </Route>
        <Route  path="/signup" element={ <SignUp/> }>  </Route>
        <Route  path="/login" element={  <Login/>  }>   </Route>
        <Route  path="/book_appointments" element={<Protected_Route>  <Book_Appointment/>  </Protected_Route> }>  </Route>
        <Route  path="/appointments" element={ <Protected_Route> <Appointments/> </Protected_Route> }>  </Route>
        <Route  path="/appointments/update/:id" element={ <Update_Appointment/>  }></Route>
        <Route  path="/forget_password" element={ <Forgetpassword/>  }></Route>
        <Route  path="/doctors" element={ <Display_doctor/>  }></Route>
      </Routes>














      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
