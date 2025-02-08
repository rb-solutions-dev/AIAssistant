"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useUser();

  console.log(user);
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
