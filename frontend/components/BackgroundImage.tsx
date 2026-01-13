import { useEffect, useState, useRef } from "react";
import useMyContext from "../hooks/useMyContext";

function BackgroundImage() {
  const { bgImg } = useMyContext(); // pull from context

  const bgEl = useRef<HTMLImageElement | null>(null);

  const [curBg, setCurBg] = useState<string>(bgImg);

  useEffect(() => {
    if (bgEl.current) {
      // blink the bg:
      bgEl.current.style.filter = "brightness(0)"; // fade out

      const timer1 = setTimeout(() => {
        setCurBg(bgImg); // set img
      }, 500);

      const timer2 = setTimeout(() => {
        bgEl.current!.style.filter = "brightness(60%) contrast(140%) saturate(60%) blur(2px)"; // fade in
      }, 1000);

      return () => {
        clearTimeout(timer1); // cleanup
        clearTimeout(timer2);
      };
    }
  }, [bgImg]);

  return (
    <div className="fixed z-[-1] top-0 left-0 min-w-[100vw] min-h-[100vh]">
      <img
        ref={bgEl}
        src={`../public/images/${curBg}`}
        className="block min-w-[100vw] min-h-[100vh] object-cover transition duration-1000"
        style={{ filter: "brightness(60%) contrast(140%) saturate(60%) blur(2px)" }}
      />
    </div>
  );
}

export default BackgroundImage;
