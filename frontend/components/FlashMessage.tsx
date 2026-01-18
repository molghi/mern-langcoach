import { useEffect, useState } from "react";
import useMyContext from "../hooks/useMyContext";

function FlashMessage() {
  const { flashMsgContent, setFlashMsgContent } = useMyContext();

  const [classes, setClasses] = useState<string>("-translate-y-[100px]"); // animation class
  const [msgType, setMsgType] = useState<string>(""); // either success or error
  const [msgText, setMsgText] = useState<string>("");

  useEffect(() => {
    if (flashMsgContent[0]) {
      // if not empty string (=has content)

      setMsgType(flashMsgContent[0]);
      setMsgText(flashMsgContent[1]);

      // show it / slide into view
      const timer1 = setTimeout(() => {
        setClasses("translate-y-[0px]");
      }, 100);

      // hide it / slide out
      const timer2 = setTimeout(() => {
        setClasses("-translate-y-[100px]");
      }, 3000);

      // hide for good
      const timer3 = setTimeout(() => {
        setFlashMsgContent(["", ""]); // hide msg
      }, 3500);

      // cleanup
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [flashMsgContent]);

  return (
    <div>
      <div
        className={`font-mono fixed top-3 left-1/2 -translate-x-[50%] transform px-4 py-2 rounded-md shadow-lg z-50 border border-2 bg-black font-bold transition duration-300 ${classes} ${
          msgType === "success" ? "border-green-700 text-green-400" : "border-red-700 text-red-400"
        }`}
      >
        {msgText}
      </div>
    </div>
  );
}

export default FlashMessage;
