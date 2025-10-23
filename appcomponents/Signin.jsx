"use client"
import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Signin = () => {

  //this is for shadcn not connected to backhend
  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  const fetchlogin = async (values) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: true,
      });

      if (data) {
        toast(`SignIn successful! Welcome ${data.user.name}`);
      } else {
        console.log("Better Auth signIn error:", error);
        toast("SignIn failed");
      }
    } catch (err) {
      console.error(err);
      toast("Something went wrong");
    }


  }

  async function onSubmit(values) {

    console.log(values)
    fetchlogin(values)

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
          <Button type="submit">SignIn</Button>
        </form>
      </Form>

    </div>

  )
}

export default Signin


