import React, { useEffect } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Stack, Text, useToast } from '@chakra-ui/react';
import { useAppSelector } from '../../app/hooks';
import axios from 'axios';
import { BASE_URL } from '../../config';
import Loader from '../Loader';
import { getSender } from '../../utilis/chat';

type propsType = {
  fetchAgain :boolean
}

const MyChats = ({fetchAgain}:propsType) => {

  const {selectedChat,setSelectedChat,chats,setChats} = ChatState();

  const {currentUser,token} = useAppSelector(data=>data.user);
  const {currentDoctor,token:docToken} = useAppSelector(data=>data.doctor);

  const toast = useToast;

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token?token:docToken}`,
        },
      };
      if(currentUser){
      var { data } = await axios.get(`${BASE_URL}/chat/patient`, config);
      } else if(currentDoctor) {
      var { data } = await axios.get(`${BASE_URL}/chat/doctor`, config);
      }

      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  },[fetchAgain])

  if (chats[0]?.latestMessage && chats[0].latestMessage.doctorSender) {
    const doctorSenderName = chats[0].latestMessage.doctorSender.name;
    console.log("content:", chats[0]?.latestMessage.content);
  } else {
    console.log("Latest message or doctor sender not available.");
  }
  

  console.log('chats-',chats[0]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack >
            {chats.map((chat:any) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {
                     getSender(currentUser ? currentUser : currentDoctor, currentUser ? chat?.doctor : chat?.user)
                  }
                </Text>
                {chat?.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.userSender?.name ? chat.latestMessage.userSender?.name : chat.latestMessage.doctorSender?.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Loader />
        )}
      </Box>
    </Box>
  )
}

export default MyChats
