import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "podsynth",
  description: "~~listen up~~",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <nav className="w-full p-4 text-primary flex flex-row justify-center">
          <div className="flex justify-between items-center max-w-xl w-full p-4 border rounded-xl bg-muted">
            <h1 className="text-sm font-medium">Podsynth</h1>
            <Button variant="link" size="sm">
              Sign in
            </Button> 
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
