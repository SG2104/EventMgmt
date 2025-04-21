"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "./loginSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function SignInForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  //secure (DoS Mitigation) - original
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await fetch("http://localhost:9000/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      window.location.href = "/events";
    } catch (err: any) {
      toast.error(err.message || "Something went wrong, Please try again");
    }
  };

  // //insecure (DoS Attack)
  // const onSubmit = async (values: z.infer<typeof loginSchema>) => {
  //   // Vulnerable: Simulating DoS (comment this out after demo)
  //   let successCount = 0;

  //   try {
  //      for (let i = 0; i < 20; i++) {
  //       const res = await fetch("http://localhost:9000/api/v1/auth/login", {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(values),
  //       });
  //       const data = await res.json();
  //       console.log(`Attempt ${i + 1}:`, data.message || data);
  //       if (res.ok) {
  //         successCount++;
  //       }
  //       if (data?.message?.includes("Too many")) {
  //         toast.warn("Rate limit triggered.");
  //         break;
  //       }
  //     }
  //   }
  //    catch (err) {
  //         console.error("Attempt failed:", err);
  //         toast.error("Network error during attack simulation.");
  //       }
  //   toast.info(`Attack simulation done. ${successCount} login(s) succeeded.`);
  //   window.location.href = "/events";
  // };

  //insecure (XSS attack)
  // const onSubmit = async (values: z.infer<typeof loginSchema>) => {
  //   console.log("onSubmit called", values);
  //   try {
  //     const res = await fetch("http://localhost:9000/api/v1/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(values),
  //     });

  //     const data = await res.json();

  //     console.log("Returned data from backend", data);

  //     if (!res.ok) {
  //       toast.error(data.message || "Login failed");
  //       return;
  //     }
  //     toast.success(data.message || "Login successful");

  //     const token = data?.data?.token;
  //     if (token) {
  //       localStorage.setItem("token", token);
  //     } else {
  //       toast.error("No token received.");
  //       return;
  //     }

  //     window.location.href = "/events";
  //   } catch (err: any) {
  //     console.error("Login request failed:", err);
  //     toast.error(err?.message || "Something went wrong. Please try again.");
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Form {...form}>
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full pb-4">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full pb-4">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
                <p className="text-sm text-center pt-4">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="text-blue-600 hover:underline">
                    Sign Up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}
