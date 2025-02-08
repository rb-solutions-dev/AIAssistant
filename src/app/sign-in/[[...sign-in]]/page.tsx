"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useUser();

  console.log(user);
  if (user) {
    redirect("/");
  }

  const path = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn path={path} />
    </div>
  );
}
