import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useAppSelector } from "../app/hooks";
import axios from "axios";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const JitsiMeet = () => {
  const email = new URLSearchParams(window.location.search).get("email");
  const name = new URLSearchParams(window.location.search).get("name");

  const { currentDoctor,token } = useAppSelector((state) => state.doctor);
  const [roomName, setRoomName] = useState<string | "">("");

 const authToken = {
  headers:{
    Authorization:`Bearer ${token}`
  }
 }

  useEffect(() => {
    const generateRoomName = () => {
      const randomRoomName = `DoctorMeetingRoom-${Math.floor(
        Math.random() * 1000
      )}`;
      setRoomName(randomRoomName);
    };
    generateRoomName();
    

  }, []);
  
  const domain = "meet.jit.si";
  const externalApiRef = useRef<any | null>(null);

  const handleApiReady = (externalApi: any) => {
    externalApiRef.current = externalApi;

    if (externalApiRef.current) {
      externalApiRef.current.executeCommand("mute", ["audio"]);
       
      sendEmail();
    }
  };
 
 
  const sendEmail = async () => {
    const link = `https://${domain}/${roomName}`;
   

    await axios.post(`${BASE_URL}/email/`,{
      email,name,link
    },authToken)
    .then((res)=>{
      console.log(res.data.message);
    })
    .catch((err)=>{
        toast.error(err.response.data.message);
    })

   /* const templateParams = {
      to_name: `${email}`,
      from_name: `${name}`,
      message: `This is the link for the meeting - ${link}`,
    };

    try {
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID , templateParams, {
        publicKey: PUBLIC_KEY,
      });
      console.log("Email sent successfully:", response);
    } catch (err) {
      console.log("Failed to send email:", err);
    }*/
  };

  return (
    <div style={{ height: "100vh", display: "grid", flexDirection: "column" }}>
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
          disableThirdPartyRequests: true,
          prejoinPageEnabled: true,
          enableWelcomePage: false,
          enableClosePage: true,
          enableNoisyMicDetection: true,
          resolution: 720,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: `${currentDoctor?.name}`,
          email: `${currentDoctor?.email}`,
        }}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "700px";
        }}
      />
    </div>
  );
};

export default JitsiMeet;
