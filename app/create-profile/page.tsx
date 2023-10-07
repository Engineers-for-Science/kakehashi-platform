import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LoginWithORCIDButton } from "@/components/LoginWithORCIDButton";
import { CreateProfileForm } from "./create-profile-form";

export default function Auth() {
  return (
    <>
      {/* <div className="hidden lg:visible">
        <video
          className=""
        />
      </div> */}
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900">
            <video className="w-full h-full object-cover bg-zinc-900" loop autoPlay muted>
              <source src="nasa_working.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="relative z-20 flex items-center text-2xl font-bold">
            <Image
              src='/kakehashi.png'
              width={30}
              height={30}
              alt="Kakehashi Logo"
              className="rounded mr-0.5"
            />
            AKEHASHI
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-md font-bold">
                &ldquo;There are many different open science and open-source projects and tools, but no efficient way to match project creators with interested collaborators who possess the skills required to contribute. This is a solution that will help people who are looking for open-source projects to work on and project creators who need skilled contributors to find each other and communicate.&rdquo;
              </p>
              <footer className="text-sm font-bold">{`> NASA Space Apps Challenge 2023`}</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">

          <div className="mx-auto flex w-full h-screen md:h-full flex-col justify-center items-center space-y-6 sm:w-[350px]">
            <div className="w-full flex items-start text-2xl font-bold md:hidden">
              <Image
                src='/kakehashi.png'
                width={30}
                height={30}
                alt="Kakehashi Logo"
                className="rounded mr-0.5"
              />
              AKEHASHI
            </div>
            <div className="flex flex-col space-y-2 md:text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create Profile
              </h1>
              <p className="text-sm text-muted-foreground">
                To create a profile on Kakehashi, please enter your prefered display name and email.
              </p>
            </div>
            <CreateProfileForm />
          </div>
        </div>
      </div>
    </>
  );
}
