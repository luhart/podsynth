"use client";

import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <LoaderIcon className="animate-spin" />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-12">
          <div className={`hidden 2xs:block md:px-8 px-4 rounded-l-full  h-3 ${email !== "" ? 'bg-green-500' : 'bg-gradient-to-r from-gray-200 to-gray-100'}`} />
          <div className={`hidden 2xs:block md:px-8 px-4 rounded-l-full h-3 ${question !== "" ? 'bg-green-500' : 'bg-gradient-to-r from-gray-200 to-gray-100'}`} />
        </div>

        <form className="flex flex-col w-full gap-4 bg-gray-50 px-4 py-6 rounded-lg border">
          <div className="font-medium tracking-tight">
            Get access to the beta when it&apos;s ready
          </div>
          <label htmlFor="email" className="flex flex-col gap-1">
            <span className="text-gray-600 text-sm font-medium block">
              Email<span className="text-gray-500 align-top ml-1">*</span>
            </span>
            <Input
              placeholder="marvin@minsky.com"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
              required
            />
          </label>
          <label htmlFor="question" className="flex flex-col gap-1 mb-2">
            <span className="text-gray-600 text-sm font-medium block">
              What would you pay me to build?
            </span>
            <Input
              id="question"
              placeholder="uhhh"
              name="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-white"
            />
          </label>
          <Button variant="default">Submit</Button>
        </form>
        <div className={`hidden 2xs:block px-12 rounded-r-full h-3 ${email !== "" && question !== "" ? 'bg-green-500' : 'bg-gradient-to-l from-gray-200 to-gray-100'}`} />
      </div>
    </div>
  );
}
