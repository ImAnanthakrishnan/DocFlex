

import { Avatar, Box,Text } from '@chakra-ui/react'

type PropsType = {
    user:{
        name:string;
        email:string;
        photo:string;
    };
    handleFunction:()=>void
}

const UserListItem = ({user,handleFunction}:PropsType) => {
 
   // const {currentUser} = useAppSelector(state=>state.user);
  return (
    <Box
    onClick={handleFunction}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
      background: "#38B2AC",
      color: "white",
    }}
    w="100%"
    display="flex"
    alignItems="center"
    color="black"
    px={3}
    py={2}
    mb={2}
    borderRadius="lg"
  >
    <Avatar
      mr={2}
      size="sm"
      cursor="pointer"
      name={user?.name}
      src={user?.photo}
    />
    <Box>
      <Text>{user?.name}</Text>
      <Text fontSize="xs">
        <b>Email : </b>
        {user?.email}
      </Text>
    </Box>
  </Box>
  )
}

export default UserListItem
