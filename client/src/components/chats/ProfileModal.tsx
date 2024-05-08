import { ViewIcon } from '@chakra-ui/icons';
import { useDisclosure,IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Image } from '@chakra-ui/react'


const ProfileModal = ({user,children}:any) => {
  
   
    const {isOpen,onOpen,onClose} = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ):(
        <IconButton aria-label='view' display="flex" icon={<ViewIcon />} onClick={onOpen} />
      )}
           

<Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent h="410px">
    <ModalHeader
    fontSize="40px"
    fontFamily="Work sans"
    display="flex"
    justifyContent="center"
    >{user.name}</ModalHeader>
    <ModalCloseButton />
    <ModalBody 
    display="flex"
    flexDir="column"
    alignItems="center"
    justifyContent="space-between"
    >
    sdfsafsaf
    </ModalBody>
      <Image
      borderRadius="full"
      boxSize="150px"
      src={user.photo}
      alt={user.photo}
       />
    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={onClose}>
        Close
      </Button>
      <Button variant='ghost'>Secondary Action</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}

export default ProfileModal
