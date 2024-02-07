import { Mail } from "lucide-react";


export const Footer = () => {
  return (
    <footer className="flex flex-row justify-center border-t w-full">
        <div className="max-w-2xl w-full flex justify-center border-l border-r p-4">
          <div className="text-gray-600 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            team@podsynth.com
          </div>
        </div>
      </footer>
  );
}