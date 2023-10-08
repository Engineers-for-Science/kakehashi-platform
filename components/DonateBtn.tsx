"use client"
import { CoffeeIcon } from "lucide-react";
import { Button } from "./ui/button";


export default function DonateBtn() {

  return (
    <>
      <a href="https://www.buymeacoffee.com/"><Button>Buy Us a Coffee <CoffeeIcon className="ml-3" /></Button></a>
    </>
  )
}