import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";




export const ChatContext=createContext()

export const ChatProvider=({children})=>{
    const[message,setMessage]=useState([])
    const[users,setUsers]=useState([])
    const[selectedUser,setSelectedUser]=useState(null)
    const[unseenMessage,setUnseenMessage]=useState({})

    const {socket,axios}=useContext(AuthContext)

    //function to get users for sidebars

    const getUsers=async()=>{
        try {
            const {data}=await axios.get("/api/message/users");
            if(data.success){
                setUsers(data.users)
                setUnseenMessage(data.unseenMessage)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //function to get meassages for selected User

    const getMessage=async(userId)=>{
        try {
            const {data}=await axios.get(`/api/message/${userId}`)
            if(data.success){
                setMessage(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send message to selected user

    const sendMessage=async(messageData)=>{
        try {
            const {data}=await axios.post(`/api/message/send/${selectedUser._id}`,messageData)
            if(data.success){
                setMessage((prevMessage)=>[...prevMessage,data.newMessage])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to subscribe to message for selected user

    const subscribeToMessage=async()=>{
        if(!socket) return

        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && selectedUser._id===newMessage.senderId){
                newMessage.seen=true
                setMessage((prevMessage)=>[...prevMessage,newMessage])
                axios.put(`/api/message/mark/${newMessage._id}`)
            }else{
                setUnseenMessage((prevUnseenMessage)=>({
                    ...prevUnseenMessage,[newMessage.senderId]:
                    prevUnseenMessage[newMessage.senderId]?prevUnseenMessage[newMessage.senderId]+1:1
                }))
            }
        })
    }

    //function to unsubscribe from message

    const unsubscribeFromMessage=()=>{
        if(socket) return socket.off("newMessage")
    }

    useEffect(()=>{
        subscribeToMessage()
        return ()=>unsubscribeFromMessage()
    },[socket,selectedUser])

    const value={
        message,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessage,
        setUnseenMessage,
        getUsers,
        getMessage,
        sendMessage,
    }

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}