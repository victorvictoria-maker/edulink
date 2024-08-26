"use client";

import FormWrapper from "@/components/FormWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { useRouter } from "next/navigation";
import SocialMedia from "@/components/SocialMedia";
import Image from "next/image";
import { register } from "@/serveractions/register";
import { RegisterSchema } from "../../../../schemas";

// #Vicky01

const RegisterPage = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      matricno: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitForm = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          setSuccess(data?.success);
        }

        if (data?.success === "Your account has been created successfully!") {
          router.push("/login");
        }
      });
    });
  };

  return (
    <div className='relative min-h-screen flex items-center justify-center bg-gray-900'>
      <div className='absolute inset-0 overflow-hidden'>
        <Image
          src='/images/students.jpg'
          alt='Background Image'
          layout='fill'
          objectFit='cover'
          className='opacity-70'
        />
        <div className='absolute inset-0 bg-black opacity-80' />
      </div>

      <div className='relative z-10 p-6 bg-white rounded-lg shadow-lg max-w-xl w-full mx-2'>
        <FormWrapper
          headerTitle='Create an account'
          buttonLabel='Already have an account?'
          buttonLink='/login'
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitForm)}
              className='space-y-6'
            >
              <div className='space-y-4'>
                <div className='flex flex-col md:flex-row md:gap-2 '>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder='Victoria Victor'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder='victorvictor0001@gmail.com'
                            type='email'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex flex-col md:flex-row md:gap-2 '>
                  <FormField
                    control={form.control}
                    name='department'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder='Computer Science'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='matricno'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Matric No (for students)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            disabled={isPending}
                            placeholder='200883'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='******'
                          type='password'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='******'
                          type='password'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type='submit' className='w-full' disabled={isPending}>
                Create an account
              </Button>
            </form>
          </Form>
        </FormWrapper>
      </div>
    </div>
  );
};

export default RegisterPage;
