"use client"
import React, { useState,createContext, useContext, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
export const ReelContext = createContext(null);
import { getStores } from "@lemonsqueezy/lemonsqueezy.js";



export const useReelContext = () =>{
  return useContext(ReelContext)
}

const ReelContextProvider = (props) => {

    const [showlogin,setshowlogin] = useState(false)
    const { data: session, isLoading} = useSession()
    const [userid,setuserid] = useState();
    const [email,setemail] = useState()
    const [reelData, setreelData] = useState("")
    const [videoUrls, setvideoUrls] = useState([])
    const [audiourl,setaudiourl] = useState([])
    const [freetiercount,setfreetiercount] = useState(0)
   

    const getuserinfo = () => {
      if(session?.user){
        setuserid(session.user.id);
        setemail(session.user.email)
      }

    }

    

    useEffect(() => {
  if (isLoading) {
    console.log("Session is still loading...");
    return;
  }
  
  console.log("Session loaded:", session);
  getuserinfo();
}, [session, isLoading])



  const contextValue = {
    setshowlogin,showlogin,userid, reelData,setreelData,videoUrls,setvideoUrls,audiourl,setaudiourl,email, freetiercount,setfreetiercount
  }



  return (
    <ReelContext.Provider value={contextValue}>
      {props.children}
    </ReelContext.Provider>
  )
}

export default ReelContextProvider