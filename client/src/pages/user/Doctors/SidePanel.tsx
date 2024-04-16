import React, { useState } from 'react'
import { BASE_URL } from '../../../config'
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../app/hooks';
import convertTime from '../../../utilis/convertTime';

type TimeSlotsType = {
    day?: string;
    startingTime?: string;
    endingTime?: string;
  }

type PropsType = {
    doctorId : string | number | undefined
    ticketPrice : number | undefined
    timeSlots: TimeSlotsType[] | undefined;
}

const SidePanel = ({doctorId,ticketPrice,timeSlots}:PropsType) => {



    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotsType | null>(null);

    const [selectedMode, setSelectedMode] = useState<string | ''>('');



    const {token} = useAppSelector(data => data.user);
console.log(selectedTimeSlot)
    const bookingHandler = async() => {

        if(selectedTimeSlot === null || selectedMode === ''){
            return toast.error('please select time and mode');
        }

        try{
            const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}`,{
                method:'post',
                headers:{
                    Authorization:`Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appointmentDate: selectedTimeSlot,
                    modeOfAppointment: selectedMode, 
                }),
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message + 'Please try again');
            }

            if(data.session.url){
                window.location.href = data.session.url
            }
        }
        catch(err:any){
            toast.error(err.message);
        }
    }
console.log('selected-',selectedTimeSlot)
  return (
<div className='shadow-panelShadow p-3 lg:p-5 rounded-md'>
    <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
            {ticketPrice} INR
        </span>
    </div>
    <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">
            Available Time Slots:
        </p>
      
            <ul className="mt-3">
                {timeSlots?.map((item,index)=>(
                <li key={index} className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" className='input__form' name="timeSlot" onChange={() => setSelectedTimeSlot(item)}/>
                    <p className="text-[15px] leading-6 text-textColor font-semibold">
                    {item.day && item.day.charAt(0).toUpperCase() + item.day.slice(1)}</p>
                    <p className="text-[15px] leading-6  text-textColor font-semibold ">{convertTime(item.startingTime)} - {convertTime(item.endingTime)}</p>
                </label>
            </li>
                ))}

            </ul>
            <p className="text__para mt-5 font-semibold text-sm text-headingColor ">
              Mode Of Meeting:
            </p>
            <div className='flex justify-around mt-2'>

            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" className='input__form' name="appointmentMode" value="offline" onChange={() => setSelectedMode('offline')}/>
                <span className="text-[15px] leading-6 text-textColor font-semibold">Offline</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" className='input__form' name="appointmentMode" value="online"  onChange={() => setSelectedMode('online')}/>
                <span className="text-[15px] leading-6 text-textColor font-semibold">Online</span>
            </label>
            </div>
            <button type="submit" className="btn px-2 w-full rounded-md mt-3" onClick={bookingHandler}>Book Appointment</button>
    </div>
</div>

  )
}

export default SidePanel
