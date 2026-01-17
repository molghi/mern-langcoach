import useMyContext from "../hooks/useMyContext";
import { useRef, useEffect, useState } from "react";
import Button from "./Button";

function PracticeQuiz() {
  const { currentPractice, currentPracticeCounter, setCurrentPracticeCounter, setFlashMsgContent, setQuizAnswers } =
    useMyContext();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [inputVal, setInputVal] = useState<string>("");
  const [btnText, setBtnText] = useState<string>("Next"); // either Next or Finish

  useEffect(() => {
    setInputVal(""); // reset input
    if (currentPracticeCounter + 1 === currentPractice.length) {
      setBtnText("Finish"); // change btn text if last round
    }
    inputRef.current?.focus(); // focus input field
  }, [currentPracticeCounter]);

  // ============================================================================

  const practiceFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputVal.trim()) {
      return setFlashMsgContent(["error", "Answer cannot be empty."]);
    }

    setQuizAnswers((prev) => [...prev, inputVal.trim()]); // register current answer

    if (currentPracticeCounter + 1 === currentPractice.length) {
      // because currentPracticeCounter is zero-based --> quiz is finished
      // render quiz results
    } else {
      // render next round
      setCurrentPracticeCounter((prev) => prev + 1);
    }
  };

  // ============================================================================

  const currentRoundData = currentPractice[currentPracticeCounter];

  return (
    <>
      <div className="flex flex-col gap-10 w-full text-[antiquewhite] text-center">
        {/* Title: what round it is */}
        <h1 className="text-2xl font-bold">
          Round {currentPracticeCounter + 1} / {currentPractice.length}
        </h1>

        {/* Smaller info title */}
        <h2 className="text-xl font-semibold italic">Recall the translation of the current word / phrase:</h2>

        {/* Word of the round */}
        <h3 className="text-4xl font-bold">{currentRoundData.word}</h3>

        {/* Other data box */}
        {currentRoundData.definition ||
          currentRoundData.category ||
          currentRoundData.example ||
          currentRoundData.img ||
          (currentRoundData.note && (
            <div className="max-w-xl mx-auto text-left flex flex-col gap-5">
              {/* Definition */}
              {currentRoundData.definition && (
                <div>
                  <span className="font-bold opacity-50 mr-4">Definition:</span>
                  <span>{currentRoundData.definition}</span>
                </div>
              )}

              {/* Category */}
              {currentRoundData.category && (
                <div>
                  <span className="font-bold opacity-50 mr-4">Category:</span>
                  <span>{currentRoundData.category}</span>
                </div>
              )}

              {/* Example */}
              {currentRoundData.example && (
                <div>
                  <span className="font-bold opacity-50 mr-4">Example:</span>
                  <span>{currentRoundData.example}</span>
                </div>
              )}

              {/* Img */}
              {currentRoundData.img && (
                <div>
                  <span className="font-bold opacity-50 mr-4">Web Image:</span>
                  <img
                    src={currentRoundData.img}
                    alt="Word Img Demonstration"
                    className="w-[250px] h-[150px] object-contain"
                  />
                </div>
              )}

              {/* Note */}
              {currentRoundData.note && (
                <div>
                  <span className="font-bold opacity-50 mr-4">Note:</span>
                  <span>{currentRoundData.note}</span>
                </div>
              )}
            </div>
          ))}

        {/* Input & Action Btn */}
        <form onSubmit={practiceFormSubmit} className="flex flex-col gap-10 max-w-xl w-full mx-auto">
          <input
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            type="text"
            placeholder="Type your answer here..."
            autoFocus
            required
            className="bg-black/50 font-inherit text-inherit px-4 py-2 cursor-pointer border border-[antiquewhite] rounded-md transition duration-200 text-white focus:shadow-[0_0_15px_antiquewhite]"
          />

          <Button
            type="submit"
            className="hover:bg-[antiquewhite] hover:text-black bg-black/50 active:opacity-50"
            style={{ fontSize: "20px", padding: "15px 20px" }}
          >
            {btnText}
          </Button>
        </form>
      </div>
    </>
  );
}

export default PracticeQuiz;
