import { createContext, useContext, useState } from "react";


const ChatContext = createContext<any | null>(null);

//let navigate = useNavigate();

function ChatProvider({ children }: any) {
 const [selectedChat,setSelectedChat] = useState<string>('')
 const [chats,setChats] = useState<any | []>([]);


  return (
    <ChatContext.Provider value={{ selectedChat, setSelectedChat , chats,setChats }}>
      {children}
    </ChatContext.Provider>
  );
}
export const ChatState = () => {
  return useContext(ChatContext);
};
/*export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatState must be used within a ChatProvider');
  }
  return context;
};*/

export default ChatProvider;
