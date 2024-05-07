import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../config'
//import { ChatState } from '../context/ChatProvider'
import { Box, Flex } from '@chakra-ui/react'
import { useAppSelector } from '../app/hooks'
import SideDrawer from '../components/chats/SideDrawer'
import MyChats from '../components/chats/MyChats'
import ChatBox from '../components/chats/ChatBox'

const ChatPage = () => {
 // const {user} = ChatState();
 
 const {currentUser} = useAppSelector(state=>state.user);
 const {currentDoctor} = useAppSelector(state=>state.doctor);
 const [fetchAgain,setFetchAgain] = useState<boolean>(false);

  return (
    <div style={{width:"100%"}}>
      {(currentUser || currentDoctor) && <SideDrawer />}
      <Box
      display="flex"
      justifyContent='space-between'
      w="100%"
      h="91.5vh"
      p='10px'
      >
        {(currentUser || currentDoctor) && <MyChats fetchAgain={fetchAgain}/>}
        {(currentUser || currentDoctor) && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage
