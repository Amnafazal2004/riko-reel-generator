// lib/auth.js
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI)

let connected = false
const connectClient = async () => {
  if (!connected) {
    try {
      await client.connect()
      console.log("✅ MongoDB client connected")
      connected = true
    } catch (error) {
      console.error("Failed to connect MongoDB client:", error.message)
      throw error
    }
  }
  return client
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db("reelgenerator")), 
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
})

export const initializeAuth = async () => {
  await connectClient()
  return auth
}

//the database will be made by the betterauth itself

//first download the betterauth mongodb 
//create this auth file 
//IN AUTH FILE
//if u want only email password then dont add socialprovider(here we did add google ka)
//create a client
//and connect them
//then create a auth client file
//add all the methods u want to use in that file
//then just make signin, out all files and do authclient.signin
//they will go to the route auth/[...all]/route.js and there post and get methods
//which will all be handled by better auth

//if u want the userid or know if user is logged in or not 