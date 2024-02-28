import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAppointment } from "src/api/appointmentAPI"
import TimeInput from "src/components/ui/timeInput";
import Calendar from 'react-calendar'
import { Button } from "src/components/ui/button";

const CreateAppointment = () => {
    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];

    const {tutorID} = useParams()
    const [date, setDate] = useState<Value>(new Date());
    const [startTime, setStartTime] = useState<string>('12:00');
    const [endTime, setEndTime] = useState<string>('13:00');
    const navigate = useNavigate();


    const handleStartTime = (value: string) => {
        setStartTime(value);
      };
    
    const handleEndTime = (value: string) => {
        setEndTime(value);
    };

    const convertDate = (stringDate:string) => {
        const inputDate = new Date(stringDate);
        const formattedDate = new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(inputDate);

        return formattedDate.replaceAll(". ", "-").replaceAll(".", "");
    }

    const formatDateTime = (time:string): string => {
        if (date) {
            //Convert to central time
            const newTimeDate = new Date(`2024-01-01T${time}:00`)
            newTimeDate.setHours(newTimeDate.getHours() + 6);
            const newTime = newTimeDate.toTimeString().slice(0, 5);

            const newDate = date.toString();
            const formattedDate = convertDate(newDate.toString())
            return `${formattedDate}T${newTime}:00.000Z`;
        }
        return ''
      };


    const handleSubmit = () => {   
      createAppointment(1, formatDateTime(startTime), formatDateTime(endTime), "https://zoom.com/placeholder")
      navigate("/tutorAvailabilities/")
    }


    return (
      <div className="">
        <div className="mt-4 ml-5">
            <h1 className="font-bold text-xl">Create Appointment</h1>
            <Calendar onChange={setDate} value={date} calendarType="gregory" />
         </div>
         <div className="mt-4 ml-5">
            <TimeInput label="Start Time" value={startTime} onChange={handleStartTime} />
            <TimeInput label="End Time" value={endTime} onChange={handleEndTime} />
        </div>

            <Button onClick={handleSubmit}>Submit</Button>
      </div>
    );
  };
  
  export default CreateAppointment;
  