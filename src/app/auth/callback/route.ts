import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const next = requestUrl.searchParams.get("next") ?? "/dashboard"; // Default redirect to student dashboard

  if (code) {
    const supabase = createClient();
    // await supabase.auth.exchangeCodeForSession(code);

    try {
      const { data: session, error } =
        await supabase.auth.exchangeCodeForSession(code);
      if (error || !session?.user) {
        throw new Error(
          error?.message || "Failed to exchange code for session."
        );
      }
      const { id, user_metadata } = session.user;
      //   console.log("Session from callback", session.session);
      //   console.log("User from callback", session.user);
      const name = user_metadata?.full_name;
      const email = user_metadata?.email;
      const matricno = user_metadata?.matricNo;
      const department = user_metadata?.department;

      // console.log(user_metadata);
      //   check if user exits with that email
      const existingUser = await db.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        // check if it is a first time user
        // console.log(existingUser);
        if (existingUser.createdAt) {
          let userRole = existingUser.role;
          if (userRole === "HOD") {
            return NextResponse.redirect(
              `${process.env.NEXT_PUBLIC_APP_URL}/admin`
            );
          }
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}${next}`
          );
        } else {
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/auth?error=There is a user with this email!`
          );
        }
      } else {
        // Create a new user in db
        await db.user.create({
          data: {
            id: id,
            name,
            email,
            department,
            matricNo: matricno,
          },
        });
        // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?success=AccountCreated`);
        // Redirect to the desired page after successful login
        console.log("Auth callback sucessfully login");
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}${next}`
        );
      }
    } catch (err) {
      console.error("OAuth Callback Error:", err);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error`
      );
    }
  }

  // return NextResponse.redirect(requestUrl.origin);

  // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${next}`);
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error`
  );
}
