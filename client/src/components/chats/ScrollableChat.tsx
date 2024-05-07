import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender,isSameSenderMargin, isSameUser } from '../../utilis/chat'
import { useAppSelector } from '../../app/hooks'
import { Avatar, Tooltip } from '@chakra-ui/react'
type PropsType = {
    messages:string[]
}
const ScrollableChat = ({messages}:PropsType) => {
    const {currentUser} = useAppSelector(state=>state.user);
    const {currentDoctor} =  useAppSelector(state=>state.doctor);
  return (

    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
   {messages &&
        messages.map((m:any, i:number) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, currentUser ? currentUser?._id : currentDoctor?._id) ||
              isLastMessage(messages, i, currentUser ? currentUser?._id : currentDoctor?._id)) && (
              <Tooltip label={m.doctorSender ? m.doctorSender.name : m.userSender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={currentUser && m.doctorSender ? m.doctorSender.name : m.userSender.name}
                  src={currentUser && m.doctorSender ? m.doctorSender.photo : m.userSender.photo}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                m.userSender?._id ? (m.userSender._id === currentDoctor?._id ? "#BEE3F8" : "#B9F5D0"):
                (m.doctorSender._id === currentUser?._id ?  "#B9F5D0" : "#BEE3F8")
                }`,
                marginLeft:  isSameSenderMargin(messages, m, i,currentUser ? currentUser?._id : currentDoctor?._id ) ,
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
  </div>

  )
}

export default ScrollableChat
