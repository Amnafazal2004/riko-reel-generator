"use client"
import React from 'react'
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { authClient } from "@/lib/auth-client";
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Signup = () => {

  const form = useForm({
    defaultValues: { email: "", name: "", password: "" },
  });

  async function onSubmit(values) {

    console.log(values)
   try {
    const response = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    })
    
    console.log("Full signup response:", response) // Add this
    
    if (response.data) {
      toast(`Signup successful! Welcome ${response.data.user.name}`)
    } else {
      console.log("Signup error:", response.error) // Add this
      toast("Signup failed")
    }
  } catch (error) {
    console.error("Signup catch error:", error) // Add this
    toast("Something went wrong")
  }


  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Signup</Button>
        </form>
      </Form>

    </div>

  )
}

export default Signup

// Tokens ka flow (Better Auth + Client)
// User login/signup
// signIn() ya signUp() call hoti hai
// Server session create karta hai → token generate hota hai
// Token browser cookie me store hota hai
// API request
// Frontend ya useSession() call → token automatically request me send hota hai
// Server token verify karta hai → agar valid → user authorized
// Logout
// Token / session delete hoti hai → user logged out