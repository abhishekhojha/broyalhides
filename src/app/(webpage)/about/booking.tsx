"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BookingVisit({w}:{w?:string}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submitted");

    // Handle form submission logic here
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={w && cn(`w-${w}`)}>Book Visit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Studio Visit</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <Input type="text" placeholder="Your Name" />
          <Input type="email" placeholder="Your Email" />
          <Textarea placeholder="Preferred date or notes" className="h-24" />
          <Button className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
