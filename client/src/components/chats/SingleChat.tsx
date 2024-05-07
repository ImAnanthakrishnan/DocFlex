import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../utilis/chat";
import { useAppSelector } from "../../app/hooks";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../config";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io,{Socket} from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../../animations/typing.json'

type PropsType = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

 let socket:Socket | undefined , selectedChatCompare : any;


const SingleChat = ({ fetchAgain, setFetchAgain }: PropsType) => {
  console.log(fetchAgain)
  const [messages, setMessages] = useState<[] | any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [typing,setTyping] = useState<boolean>(false);
  const [isTyping,setIsTyping] = useState<boolean>(false)

  const { selectedChat, setSelectedChat } = ChatState();
  const { currentUser,token } = useAppSelector((state) => state.user);
  const { currentDoctor,token:docToken } = useAppSelector((state) => state.doctor);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const authToken = {
    headers:{
      Authorization:`Bearer ${currentUser?token:docToken}`
    }
  }
  const toast = useToast();

  const fetchMessages = async()=>{
    if(!selectedChat) return;
    
    let result ;

    try{
      setLoading(true);
      if(currentUser){
        result = await axios.get(`${BASE_URL}/message/patient/${selectedChat._id}`,authToken);
      } else if(currentDoctor){
        result = await axios.get(`${BASE_URL}/message/doctor/${selectedChat._id}`,authToken);
      }
      setMessages(result?.data);
      setLoading(false);

      socket?.emit("join chat",selectedChat._id);

    }catch(err){
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup",currentUser?currentUser:currentDoctor);
    socket.on("connected", () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing' , () => setIsTyping(false));
  },[])


  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat

  },[selectedChat]);

  useEffect(() =>{
    socket?.on("message recieved" , (newMessageRecieved) =>{
      if(!selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notiification
      }else{
        setMessages([...messages,newMessageRecieved])
      }
    })
  })

  const sendMessage =async(e:React.KeyboardEvent<HTMLDivElement>) => {
    if(e.key === "Enter" && newMessage){
      socket?.emit('stop typing',selectedChat._id);

      let result ;
       try{
        setNewMessage("");

        if(currentUser){
          result = await axios.post(`${BASE_URL}/message/patient`,{
            content:newMessage,
            chatId:selectedChat._id,
          },authToken);
        }
        else if(currentDoctor){
          result = await axios.post(`${BASE_URL}/message/doctor`,{
            content:newMessage,
            chatId:selectedChat._id,
          },authToken);
        }
        
        socket?.emit('new message',result?.data);

        setMessages([...messages,result?.data])
       }
       catch(err){
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
       }
    }
  }


  const typingHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket?.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();

    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timerLength && typing){
        socket?.emit("stop typing" , selectedChat._id);
        setTyping(false);
      }
    },timerLength)

  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              aria-label=""
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {getSender(
              currentUser ? currentUser : currentDoctor,
              currentUser ? selectedChat.doctor : selectedChat.user
            )}
            <ProfileModal
              user={getSenderFull(
                currentUser ? currentUser : currentDoctor,
                currentUser ? selectedChat.doctor : selectedChat.user
              )}
            />
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="message">
                  <ScrollableChat messages={messages}/>
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Lottie
                     options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a User to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
