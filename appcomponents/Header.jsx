"use client"
import { useSession } from '@/lib/auth-client'
import React, { useEffect } from 'react'
import Signout from './Signout'
import Signin from './Signin'
import Signup from './Signup'
import GoogleSignin from './Googlesignin'
import Checker from './Checker'



const Header = () => {
  const { data: session, error, isPending } = useSession()
  //session k ander saara data hoga of user database and session database 
  //error k ander, agar koi problem hojayega to wo batayega kis wajah se
  //ispending is basically k session load hua k nhi 
  
 // (this is optional too)
  useEffect(() => {
    console.log("Session state changed:", { session, error, isPending })
  }, [session, error, isPending])
  
  // Also check cookies (marzi hai kero ya nhi kero optional)
  useEffect(() => {
    console.log("All cookies:", document.cookie)
  }, [])

  //this tells if the session is loaded 
  if (isPending) {
    return <div>Loading session...</div>
  }
  
  //why session failed to load
  if (error) {
    console.error("Session error:", error)
    return <div>Session error: {error.message}</div>
  }

  return (
    <>
    <div>
      {session?.user ? 
        <div>
          <p>Welcome {session.user.name || session.user.email}!</p>
          <Signout/>
        </div>
        :
        <div>
          <p>Not signed in</p>
          <Signin/>
          <GoogleSignin/>
          <Signup/>
        </div>
      }
    </div>
    </>
  )
}

export default Header