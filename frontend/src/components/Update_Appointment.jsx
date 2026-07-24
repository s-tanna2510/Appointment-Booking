import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

export default function Update_Appointment(){
    const [appointmentData,setappointmentData] = useState({
        name: "",
    number: "",
    speciality: "",
    doctor: "",
    date: "",
    day: "",
    time: "",
    reason: ""
    });
    const navigate = useNavigate();
    const {id} = useParams();

    console.log(id);

    useEffect(()=>{
        getPopulateData(id);
    },[id]);

    ////// this is for get api for populate data
    async function getPopulateData(id){
        let response = await fetch(`http://localhost:3533/appointment/${id}`,{credentials : "include"})// for a appointent
        response = await response.json();
        // console.log(response);

        if(response.result)
        {  setappointmentData(response.result); }
    }

    ///////// this is patch api for update data 
    async function updateAppointment(e){
        e.preventDefault();
        console.log(appointmentData);
        
        
        let appointment_update = await fetch(`http://localhost:3533/update_appointment/${id}`,{// for update appointment
            method : "PUT",
            body : JSON.stringify(appointmentData),
            headers : {
                'Content-Type':'application/json'
            },
            credentials : "include"
        })

        appointment_update = await appointment_update.json();
        console.log(appointment_update);

        if(appointment_update)
        {  navigate("/appointments")  }
    }

    return(
        <form onSubmit={updateAppointment}>
            <h3>Update Appointment</h3>
            <label>Your Name</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,name:event.target.value})}
            value={appointmentData?.name}  type="text" placeholder="Enter Patient Name" required></input>

            <label>Contact No.</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,number:event.target.value})}
            value={appointmentData.number} type="text" placeholder="Contact No." required></input>

            {/* <label>Address</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,address:event.target.value})}
            type="text" placeholder="Enter Address" required></input> */}

            <label>Speciality</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,speciality:event.target.value})}
            value={appointmentData.speciality} type="text" placeholder="select Speciality" required></input>

            <label>Doctor Name</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,doctor:event.target.value})}
            value={appointmentData.doctor} type="text" placeholder="Doctor name" required></input>

            <label>Appointment Date</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,date:event.target.value})}
            value={appointmentData.date} type="date" placeholder="select date" required></input>

            <label>Appointment Day</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,day:event.target.value})}
            value={appointmentData.day} type="text" placeholder="select day" required></input>

            <label>Appointment Time</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,time:event.target.value})}
            value={appointmentData.time} type="time" placeholder="select time" required></input>

            <label>Reason for Appointment</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,reason:event.target.value})}
            value={appointmentData.reason} type="text" placeholder="Enter Reason" required></input>

            <button className="signupb">Update data</button>
        </form>
    )
}