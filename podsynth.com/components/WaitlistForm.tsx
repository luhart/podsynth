"use client";

import { ArrowRight, CheckCircle, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

export default function WaitlistForm() {
  const [email, setEmail] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-12">
          <div
            className={`hidden 2xs:block sm:px-8 px-4 rounded-l-full border border-r-0 h-2 ${
              email !== ""
                ? "bg-gradient-to-r from-green-200 to-green-100 border-green-200"
                : "bg-gradient-to-r from-gray-200 to-gray-100"
            }`}
          />
          <div
            className={`hidden 2xs:block sm:px-8 px-4 border border-r-0 rounded-l-full h-2 ${
              question !== ""
                ? "bg-gradient-to-r from-green-200 to-green-100 border-green-200"
                : "bg-gradient-to-r from-gray-200 to-gray-100"
            }`}
          />
        </div>

        <form className="flex flex-col w-full gap-4 bg-gray-50 px-4 py-6 rounded-lg border">
          {!submitted ? (
            <>
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
                  What would you like to see in the beta?
                </span>
                <Input
                  id="question"
                  placeholder="uhh..."
                  name="question"
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-white"
                />
              </label>
              <Button variant="default" disabled={loading} className="flex flex-row justify-between items-center group px-6">
                <div className="w-4" />
                <div className="flex flex-row gap-1 items-center">
                  Submit
                  {loading && (
                    <LoaderIcon className="animate-spin w-4 h-4 text-white ml-2" />
                  )}
                </div>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </>
          ) : (
            <div className="w-full gap-4 flex flex-row justify-center  py-4 px-3 rounded-xl bg-green-50 border border-green-300 items-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div className="">
                <div className="text-green-600 font-bold tracking-tight">
                  See you soon!
                </div>
                <div className="text-green-600">
                  In the meantime,{" "}
                  <Link href="#preview" className="underline text-medium">
                    try the preview
                  </Link>{" "}
                  ↓
                </div>
              </div>
            </div>
          )}
        </form>
        <div
          className={`hidden 2xs:block sm:px-12 px-6 border border-l-0 rounded-r-full h-2 ${
            email !== "" && question !== ""
              ? "bg-gradient-to-l from-green-200 to-green-100 border-green-200"
              : "bg-gradient-to-l from-gray-200 to-gray-100"
          }`}
        />
      </div>
    </div>
  );
}
