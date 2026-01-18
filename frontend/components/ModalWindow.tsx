import Button from "./Button";

interface Props {
  title: string;
  text: string[] | string;
  okayAction?: () => void; // function type
  cancelAction?: () => void; // function type
}

function ModalWindow({ title, text, okayAction, cancelAction }: Props) {
  return (
    <div className="fixed z-[10] bg-black/60 top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-sm">
      <div className="font-mono fixed z-[15] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-xl border-[antiquewhite] text-[antiquewhite] bg-black w-[90vw] sm:w-[80vw] lg:w-auto max-w-auto lg:max-w-xl mx-auto p-6 lg:p-12 flex flex-col gap-8 shadow-[0_0_10px_white]">
        {/* Title */}
        <div className="text-2xl font-bold text-center">{title}</div>

        {/* Text */}
        {typeof text === "string" ? (
          <div>{text}</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {text.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        )}

        {/* Button */}
        <div className="text-right">
          <Button
            onClick={cancelAction}
            className="hover:bg-[antiquewhite] hover:text-black active:opacity-70 mr-4"
            style={{ fontSize: "20px", padding: "10px 20px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={okayAction}
            className="hover:bg-green-500 hover:text-black active:opacity-70"
            style={{ fontSize: "20px", padding: "10px 20px" }}
          >
            Okay
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalWindow;
