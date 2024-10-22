"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "../../schemas";
import { getUserByEmail } from "@/fetchdatafromdb/getuser";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.log("Register user function called");
  const supabase = createClient();
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password, confirmPassword, department, matricno } =
    validatedFields.data;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userExist = await getUserByEmail(email);

  if (userExist) {
    return { error: "There is a user with this email, kindly login!" };
  }

  // Register user with Supabase
  console.log("Registering with supabase");
  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Store user information in Prisma
  await db.user.create({
    data: {
      id: user.user?.id,
      name,
      email,
      department,
      matricNo: matricno,
      password: hashedPassword,
    },
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");

  return { success: "Your account has been created successfully!" };
};
