import useMyContext from "../hooks/useMyContext";
import ViewAllEntry from "./ViewAllEntry";
import Button from "./Button";
import { useState } from "react";
import { saveQuizResults } from "../utils/dbFunctions";

function PracticeQuizResults() {
  const {
    quizAnswers,
    currentPractice,
    setCurrentPractice,
    setIsLoading,
    setFlashMsgContent,
    setCurrentPracticeCounter,
  } = useMyContext();

  const [ratings, setRatings] = useState<any[]>([]); // arr of arrs: every inner arr is [currentWord, itsCurrentRating]

  // ============================================================================

  // upon clicking Submit Results:
  const rememberResults = async () => {
    setIsLoading(true);
    const updateSuccessful = await saveQuizResults(currentPractice, ratings); // do the db update; returns boolean
    setIsLoading(false);
    if (updateSuccessful) {
      setFlashMsgContent(["success", "Quiz results saved!"]);
    } else {
      setFlashMsgContent(["error", "Error saving results."]);
    }
    setCurrentPractice([]); // reset practice material -> changing it redirects to Practice Lang Choice screen
    setCurrentPracticeCounter(0); // reset quiz counter
  };

  // ============================================================================

  return (
    <div className="flex flex-col gap-10 w-full text-[antiquewhite] text-center">
      {/* Title */}
      <h1 className="text-2xl font-bold">Assess your knowledge</h1>

      {/* Quiz rounds & user's answers */}
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-8 mb-8">
        {currentPractice.map((el, i) => (
          <ViewAllEntry
            key={i}
            data={el}
            mode="quiz_round"
            answer={quizAnswers[i]}
            setRatings={setRatings}
            ratings={ratings}
          />
        ))}
      </div>

      {/* Action button */}
      <div className="text-right mr-10">
        {/* Info msg */}
        {ratings.length < currentPractice.length && (
          <span className="bg-black/50 rounded-[5px] px-4 py-1.5 mr-6">Please rate every round to proceed</span>
        )}

        <Button
          onClick={rememberResults}
          style={{ padding: "15px 20px", fontSize: "20px" }}
          className={`bg-black/50 hover:bg-[antiquewhite] hover:text-black ${
            ratings.length < currentPractice.length ? "pointer-events-none opacity-50 bg-[#555] italic" : ""
          }`}
        >
          Submit Results
        </Button>
      </div>
    </div>
  );
}

export default PracticeQuizResults;
