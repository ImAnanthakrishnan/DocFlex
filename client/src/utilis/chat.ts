//import { useAppSelector } from "../app/hooks"
/*const {currentUser} = useAppSelector(state=>state.user);
const {currentDoctor} = useAppSelector(state=>state.doctor);*/

export const getSender = (loggedUser:any,user:any) => {
    return user && user._id !== loggedUser._id ?  user.name : loggedUser.name
}

export const getSenderFull = (loggedUser:any,user:any) => {
    return user._id !== loggedUser._id ? user : loggedUser
}

export const isSameSender = (messages:any[],m:any,i:number,userId:string | number | undefined) => {
    console.log('ind-',i)
    console.log(messages[i])
    console.log('m-',m)
    if(messages[i].doctorSender){
        return (
            i < messages.length - 1 && 
            (messages[i+1].doctorSender?._id !== m.doctorSender?._id ||
                messages[i+1].doctorSender?._id === undefined
            ) &&
            messages[i].doctorSender?._id !== userId
        )
    }else if(messages[i].userSender){
        
        return (
            i < messages.length - 1 && 
            (messages[i+1].userSender?._id !== m.userSender?._id ||
                messages[i+1].userSender?._id === undefined
            ) &&
            messages[i].userSender?._id !== userId
        )
    }

}

export const isLastMessage = (messages:any[],i:number,userId:string | number | undefined) =>{
    if(messages[i].doctorSender){
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].doctorSender._id !== userId &&
            messages[messages.length - 1].doctorSender._id
        )
    }
    else if(messages[i].userSender){
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].userSender._id !== userId &&
            messages[messages.length - 1].userSender._id
        )
    }
}

export const  isSameSenderMargin = (messages:any[],m:any,i:number,userId:any)=>{

    if(messages[i].doctorSender){
        if(
            i<messages.length -1 && 
              messages[i+1].doctorSender?._id === m.userSender?._id &&
              messages[i].doctorSender?._id !== userId
        )
        return 33;
        else if(
      
                i<messages.length -1 && 
                  messages[i+1].doctorSender?._id === m.userSender?._id &&
                  messages[i].doctorSender?._id !== userId ||
                  (i === messages.length -1 && messages[i].doctorSender?._id !== userId)

        )
        return 0
        else return "auto"
    }
    else if(messages[i].userSender){
        if(
            i<messages.length -1 && 
              messages[i+1].userSender?._id === m.doctorSender?._id &&
              messages[i].userSender?._id !== userId
        )
        return 33;
        else if(
      
                i<messages.length -1 && 
                  messages[i+1].userSender?._id === m.doctorSender?._id &&
                  messages[i].userSender?._id !== userId ||
                  (i === messages.length -1 && messages[i].userSender?._id !== userId)

        )
        return 0
        else return "auto"
    }

}

export const isSameUser = (messages:any[],m:any,i:number) => {
    if(messages[i].doctorSender){
        return i>0 && messages[i-1].doctorSender?._id === m.userSender?._id
    }else if(messages[i].userSender){
        return i>0 && messages[i-1].userSender?._id === m.doctorSender?._id
    }
   
}