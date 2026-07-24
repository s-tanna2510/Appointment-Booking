import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Book_Appointment(){
    const [appointmentData,setappointmentData] = useState({});
    const [doctorData,setdoctorData] = useState([]);
    const [mode,setMode] = useState(localStorage.getItem("mode") || "Light");
    const navigate = useNavigate();

    useEffect(()=>{
        getdoctordata();

        const toggle_mode = ()=>{
            setMode(localStorage.getItem("mode"));
        }

        window.addEventListener("mode-change",toggle_mode);
        return()=>{
            window.removeEventListener("mode-change",toggle_mode);
        }
    },[]);


    async function getdoctordata(){
        // console.log("doctordata=",doctorData);

        let result = await fetch("http://localhost:3533/doctors",{
            credentials : "include"
        })
        result = await result.json();

        console.log(result.result[0].speciality);

        if(result.success)
        {
            setdoctorData(result.result)
        }
    }
    // console.log(doctorData);
    
    const specialities = [...new Set(doctorData.map(doc => doc.speciality))];

    // const doctorsname = doctorData.map(doc => doc.name);
    //map(new array) = transform data, return new value, change structure(new array has modify data)

    const filterDoctors = doctorData.filter(filterdoc => filterdoc.speciality === appointmentData.speciality);
    //filter(new array)(array of object) = select data, return same object(original elements), not change structure

    console.log("speciality=",specialities);
    // console.log("doctorname=",doctorsname);
    console.log("filter=",filterDoctors);//it is object with fullfil condition

    const doctor = filterDoctors.find(doc=>doc.name === appointmentData.doctor);
    //find(single object) = same as filter

    const timesolts_particular_doctor = doctor ? generateTimesolts(doctor.start_time,doctor.end_time) : [];
    
    function generateTimesolts(stime,etime){
        const slots = [];

        let [first_h , first_m] = stime.trim().split(":").map(Number);
        let [last_h , last_m] = etime.trim().split(":").map(Number);//use map(Number) for convert string to number

        let startMinutes = first_h * 60 + first_m;
        let endMinutes = last_h * 60 + last_m;

        // console.log(first_h); console.log(last_h);console.log(first_m);console.log(last_m);
        // console.log(startMinutes);console.log(endMinutes);

        while(startMinutes < endMinutes)
        {
            const hour = String(Math.floor(startMinutes / 60)).padStart(2,"0");
            const minutes = String(startMinutes % 60).padStart(2,"0");//padstart use for showing 08:05 instead of 8:5
            slots.push(`${hour}:${minutes}`);
            // console.log("hour=",hour);console.log("minute=",minutes);
            startMinutes = startMinutes+15;
        }
        return slots;  
    }
    console.log(timesolts_particular_doctor);

    useEffect(() => {
        if (doctor) {
            setappointmentData(prev => ({
                ...prev,
                date: doctor.date,
                day : doctor.day
            }));
        }
    }, [doctor]);
    
    async function bookAppointment(event){
        event.preventDefault();
        console.log("data=",appointmentData.time);

        let result = await fetch("http://localhost:3533/book_appointment",{
            method : 'POST',
            body : JSON.stringify(appointmentData),
            headers : {
                'Content-Type':'application/json'
            },
            credentials : "include"
        })

        result = await result.json();
        if(result.success)
        {   
            navigate("/appointments");
            // slots.pop(appointmentData.time);
            // console.log(timesolts_particular_doctor);
            console.log("dt=",appointmentData);
            
            
            console.log("user appointment booked");  
        }
    }

    return(
        <form onSubmit={bookAppointment} className={`${mode === "Dark"? "dark" : ""}`}>
            <h3 className="book_appointment">Book Appointment</h3>
            <label className={`${mode === "Dark"? "dark" : ""}`}>Patient Name</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,name:event.target.value})}
            className={`${mode === "Dark"? "dark" : ""}`} type="text" placeholder="Enter Patient Name" required></input>

            <label className={`${mode === "Dark"? "dark" : ""}`}>Contact No.</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,number:event.target.value})}
            className={`${mode === "Dark"? "dark" : ""}`} type="text" placeholder="Enter Contact No." required></input>

            <label className={`${mode === "Dark"? "dark" : ""}`}>Age</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,age:event.target.value})}
            className={`${mode === "Dark"? "dark" : ""}`} type="text" placeholder="Enter Age" required></input>

            <label className={`${mode === "Dark"? "dark" : ""}`}>Speciality</label>
            {/* <input onChange={(event)=>setappointmentData({...appointmentData,speciality:event.target.value})}
            type="text" placeholder="select Speciality" required></input> */}

            <select  onChange={(event)=>setappointmentData({...appointmentData,speciality:event.target.value})} className={`${mode === "Dark"? "dark" : ""}`} required>
                <option value="" className={`Opnull ${mode === "Dark"? "dark" : ""}`} >Select Speciality</option>

                {specialities.map((spec, index)=>(
                <option key={index} value={spec} >{spec}</option>
                ))}

            </select>

            <label className={`${mode === "Dark"? "dark" : ""}`}>Doctor Name</label>
            {/* <input onChange={(event)=>setappointmentData({...appointmentData,doctor:event.target.value})}
            type="text" placeholder="Doctor name" required></input> */}

            <select onChange={(event)=>{
                // const doctor = filterDoctor.find(d => d._id === e.target.value);
                // setSelectedDoctor(doctor);
                setappointmentData({...appointmentData,doctor:event.target.value})} }  className={`${mode === "Dark"? "dark" : ""}`} required>
                <option value="" className={`Opnull ${mode === "Dark"? "dark" : ""}`} >Doctor name</option>
                {
                    filterDoctors.map((doc) => (
                        <option key={doc._id} value={doc.name} >{doc.name}</option>
                    ) )
                }
            </select>

            {/* <label>Appointment Date</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,date:event.target.value})}
            type="date" placeholder="select date" required></input> */}

            <label className={`${mode === "Dark"? "dark" : ""}`}>Appointment Date</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,date:event.target.value})}
            className={`${mode === "Dark"? "dark" : ""}`} type="text" value={ appointmentData.date || ""} placeholder="select date" required></input>

            <label className={`${mode === "Dark"? "dark" : ""}`}>Appointment Day</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,day:event.target.value})}
            className={`${mode === "Dark"? "dark" : ""}`} type="text" value={ doctor?doctor.day:""} placeholder="Enter day" required></input>

            <label className={`${mode === "Dark"? "dark" : ""}`}>Appointment Time</label>
            {/* <input onChange={(event)=>setappointmentData({...appointmentData,time:event.target.value})}
            type="time" placeholder="select time" required></input> */}

            <select onChange={(event)=>setappointmentData({...appointmentData,time:event.target.value})} className={`${mode === "Dark"? "dark" : ""}`} required>
                <option value="" className={` Opnull ${mode === "Dark"? "dark" : ""}`} >Select Time</option>
                {
                    timesolts_particular_doctor.map((solts,index)=>(
                        <option key={index} value={solts}> {solts} </option>
                    ))
                }
            </select>

            <label className={`${mode === "Dark"? "dark" : ""}`}>Reason for Appointment</label>
            <input onChange={(event)=>setappointmentData({...appointmentData,reason:event.target.value})}
            className={`${mode === "Dark"? "dark" : ""}`} type="text" placeholder="Enter Reason" required></input>

            <button className="signupb">Book Appointment</button>
        </form>
    )
}