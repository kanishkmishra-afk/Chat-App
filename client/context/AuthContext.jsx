import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

const backendUrl=import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL=backendUrl

export const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const[token,setToken]=useState(localStorage.getItem("token"))
    const[authUser,setAuthUser]=useState(null)
    const[socket,setSocket]=useState(null)
    const[onlineUsers,setOnlineUsers]=useState([])


    //check if user is authenticated
    const checkAuth=async()=>{
        try {
            const {data}= await axios.get("/api/auth/check")
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //connect socket function

    const connectSocket=(userData)=>{
        if(!userData || socket?.connected) return

        const newSocket=io(backendUrl,{
            query:{
                userId:userData._id
            }
        })
        //this line is not needed as socket.io v4 automatically connects
        // newSocket.connect()
        setSocket(newSocket)
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds)
        })
    }
    //login function to handle auth and socket

    const login=async(state,credentials)=>{
        try {
            const {data}= await axios.post(`/api/auth/${state}`,credentials)
            if(data.success){
                
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"]=data.token
                setToken(data.token)
                localStorage.setItem("token",data.token)
                toast.success(data.message)
            }else{
                console.log(state);
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //logout function to handle logout user and disconncet socket

    const logout=()=>{
        localStorage.removeItem("token")
        setAuthUser(null)
        axios.defaults.headers.common["token"]=null
        setOnlineUsers([])
        setToken(null)
        toast.success("logged out successfully")
        socket.disconnect();
    }

    //function to handle user profile updates

    const updateProfile=async(body)=>{
        try {
            const {data}=await axios.put("/api/auth/update-profile",body)
            if(data.success){
                setAuthUser(data.user)
                toast.success("profile updated successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token
        }
        checkAuth()
    },[])

    const value={
        axios,
        authUser,
        socket,
        onlineUsers,
        login,
        logout,
        updateProfile
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}