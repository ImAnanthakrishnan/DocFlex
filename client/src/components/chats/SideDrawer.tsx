import { Box,Button,MenuButton,Text,Tooltip,Menu,MenuList, Avatar, MenuItem, Drawer, useDisclosure, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody, Input,useToast, Spinner } from '@chakra-ui/react';
import  { useState } from 'react'

import { FaSearchengin } from 'react-icons/fa6';
import { IoMdNotifications } from "react-icons/io";
import {ChevronDownIcon} from '@chakra-ui/icons'
import { useAppSelector } from '../../app/hooks';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import { BASE_URL } from '../../config';
import Loader from '../Loader';
import UserListItem from './UserAvata/UserListItem';
import { ChatState } from '../../context/ChatProvider';


const SideDrawer = () => {

    const {currentUser,token} = useAppSelector(state=>state.user);
    const {currentDoctor,token:docToken} = useAppSelector(state=>state.doctor);
    
    const {isOpen,onOpen,onClose} = useDisclosure();
    const [search,setSearch] = useState<string>("");
    const [searchResult,setSearchResult] = useState<[]|any>([]);
    const [loading,setLoading] = useState(false);
    const [loadingChat,setLoadingChat] = useState<boolean>(false);

    const {setSelectedChat,chats,setChats} = ChatState();

    const toast = useToast
    let token1 = token ? token : docToken;
  
    const authToken = {
        headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${token1}`
        }
    }

    const handleSearch = async() => {
        if(!search){
            toast({
                title:"Please Enter something in search",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left"
            });
            return;
        }
        try{
            setLoading(true)
            let result ;
            if(currentUser){
            result = await axios.get(`${BASE_URL}/user/users?search=${search}`,authToken);
            }
            else{
            result = await axios.get(`${BASE_URL}/doctors/doctor?search=${search}`,authToken);
            }
          
            setLoading(false);
            setSearchResult(result.data);

        }        
        catch(err){
            toast({
                title:"Error Occured",
                description:"Failed to load the search result",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-left"
            });
           
        }
    }

    const accessChat = async(userId:string) => {
        try{
            setLoadingChat(true);

            if(currentUser){
                var {data} = await axios.post(`${BASE_URL}/chat/patient`,{userId},authToken);
            }
            else if(currentDoctor){
                var {data} = await axios.post(`${BASE_URL}/chat/doctor`,{userId},authToken);
            }

            if(!chats.find((c:any) => c._id === data._id)) setChats([data,...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        }
        catch(err:any){
            toast({
                title:"Error Occured",
                description:err.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-left"
            });
        }
    }
   
   
  return (
    <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px"
    >
      <Tooltip
        label="Search Users to chat" 
        placement="bottom-end"
        hasArrow
      >
        <Button variant="ghost" onClick={onOpen}>
          <i><FaSearchengin /></i>
          <Text display={{base:"none",md:"flex"}} px="4">
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Works sans" >
        Chat 
      </Text>
      <div>
        <Menu>
            <MenuButton p={1}>
            <IoMdNotifications size={30}  />
            </MenuButton>
            <MenuList>

            </MenuList>
        </Menu>
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar size="sm" cursor="pointer" name={currentUser?currentUser?.name:currentDoctor?.name} src={currentUser?currentUser?.photo:currentDoctor?.photo} />
            </MenuButton>
            <MenuList>
                <ProfileModal user = {currentUser ? currentUser:currentDoctor}>
                <MenuItem>My Profile</MenuItem>
                </ProfileModal>
            </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer
    placement='left'
    onClose={onClose}
    isOpen={isOpen}
    >
        <DrawerOverlay/>
        <DrawerContent >
        <DrawerHeader borderBottomWidth="1px">Search</DrawerHeader>
        <DrawerBody>
            <Box display="flex" pb={2}>
            <Input
            placeholder='Search by name or email'
            mr={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
                <Loader />
            ):(
                searchResult.map((user:any) => (
                    <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={()=>accessChat(user._id)}
                     />
                ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
        </DrawerBody>
        </DrawerContent>
    </Drawer>

    </>
  )
}

export default SideDrawer
