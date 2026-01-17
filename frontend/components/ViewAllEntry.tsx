import { languages, languageColors } from "../context/MyContext";
import useMyContext from "../hooks/useMyContext";
import { deleteOneEntry, getUserEntries } from "../utils/entryDbFunctions";
import type { EntryInterface } from "../context/MyContext"; // import as type
import Button from "./Button";

interface Props {
  data: EntryInterface;
  mode?: string;
  answer?: string;
  ratings?: any[];
  setRatings?: React.Dispatch<React.SetStateAction<any[]>>;
}

function ViewAllEntry({ data, mode = "view_all_entry", answer, setRatings, ratings }: Props) {
  const {
    setItemInEdit,
    setActiveTab,
    setEntries,
    setFlashMsgContent,
    setLanguagesAdded,
    setCategoriesAdded,
    setAllEntriesCount,
    setEntriesMatchingQueryCount,
    currentPractice,
    setUserEmail,
  } = useMyContext();

  // format date string nicely
  const getWhenAdded = (dateStr: string | undefined) => {
    if (!dateStr) return;
    const formatter = new Intl.DateTimeFormat("en-UK", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // for am/pm
    });
    const date = new Date(dateStr);
    return formatter.format(date);
  };

  // ============================================================================

  // show edit form
  const showEdit = () => {
    setItemInEdit(data); // remember current item
    setActiveTab(0); // switch to tab 1
  };

  // prompt to delete entry
  const promptDeletion = async () => {
    const answer = confirm(
      `Are you sure you want to delete this entry?\n\n${languages.find((x) => x.key === data.language)!["name"]} — ${
        data.word
      }\n\nCareful! This action cannot be undone.`
    );
    if (!answer) return;
    if (data._id) {
      const deletedSuccessfully = await deleteOneEntry(data._id, setFlashMsgContent); // delete and re-fetch
      if (deletedSuccessfully)
        await getUserEntries(
          setEntries,
          setLanguagesAdded,
          setCategoriesAdded,
          setAllEntriesCount,
          setEntriesMatchingQueryCount,
          setUserEmail
        );
    }
  };

  // ============================================================================

  // shown after quiz finished; on Quiz results
  const assessmentBtnsConfig = [
    {
      name: "Fail",
      title: "Did not recall or recalled incorrectly",
      classes: "border-red-500 active:opacity-70 hover:bg-red-700 hover:text-white",
      activeClasses: "bg-red-700 text-white",
    },
    {
      name: "Hard",
      title: "Recalled, but with significant effort or hesitation",
      classes: "border-orange-500 active:opacity-70 hover:bg-orange-600 hover:text-white",
      activeClasses: "bg-orange-600 text-white",
    },
    {
      name: "Good",
      title: "Recalled correctly without struggle",
      classes: "border-blue-500 active:opacity-70 hover:bg-blue-500 hover:text-white",
      activeClasses: "bg-blue-500 text-white",
    },
    {
      name: "Easy",
      title: "Recalled instantly and confidently",
      classes: "border-green-500 active:opacity-70 hover:bg-green-600 hover:text-white",
      activeClasses: "bg-green-600 text-white",
    },
  ];

  // ============================================================================

  // this is essentially to mark a clicked btn with an active class, and unlock the bottom btn (Submit results)
  const registerRating = (rating: string) => {
    if (setRatings)
      setRatings((prev) => {
        let entry = prev.find((el) => el[0] === data.word); // find this entry
        if (entry && Array.isArray(entry)) {
          // if found, overwrite
          entry[1] = rating;
          let indexToRemove = prev.findIndex((el) => el[0] === data.word);
          prev.splice(indexToRemove, 1); // remove old entry to avoid duplicates
        } else {
          // if not found, create
          entry = [data.word, rating];
        }
        return [...prev, entry];
      });
  };

  // ============================================================================

  return (
    <div
      className={`border border-[${languageColors[data.language]}] text-[${
        languageColors[data.language]
      }] rounded-lg p-4 bg-black/40 flex gap-4 justify-between hover:bg-black/70 flex-col sm:flex-row word-entry-block`}
    >
      {/* Fields */}
      <div className="flex flex-col gap-2 text-left">
        {/* Language */}
        <div>
          <span className="font-bold opacity-30">Language:</span>{" "}
          <span>{languages.find((x) => x.key === data.language)!["name"]}</span>
        </div>

        {/* Word */}
        <div>
          <span className="font-bold opacity-30">Word:</span> <span>{data.word}</span>
        </div>

        {/* Translation */}
        <div>
          <span className="font-bold opacity-30">Translation:</span>{" "}
          <span className={`${currentPractice.length > 0 ? "" : "translation"}`}>{data.translation}</span>
        </div>

        {/* Your Answer */}
        {answer && answer.length > 0 && (
          <div>
            <span className="font-bold opacity-60">Your Answer:</span> <span className="text-white">{answer}</span>
          </div>
        )}

        {/* Definition */}
        {data.definition && (
          <div>
            <span className="font-bold opacity-30">Definition:</span> <span>{data.definition}</span>
          </div>
        )}

        {/* Category */}
        {data.category && (
          <div>
            <span className="font-bold opacity-30">Category:</span> <span>{data.category}</span>
          </div>
        )}

        {/* Example */}
        {data.example && (
          <div>
            <span className="font-bold opacity-30">Example:</span> <span>{data.example}</span>
          </div>
        )}

        {/* Note */}
        {data.note && (
          <div>
            <span className="font-bold opacity-30">Note:</span> <span>{data.note}</span>
          </div>
        )}

        {/* Web Img */}
        {data.img && (
          <div className="flex gap-4">
            <span className="font-bold opacity-30">Web Image:</span>{" "}
            <img alt="Web Image" src={data.img} className="max-w-[200px] object-contain" />
          </div>
        )}

        {/* Created at */}
        <div className="text-[12px] transition duration-200 opacity-70 hover:opacity-100">
          <span className="font-bold opacity-30 transition duration-300 hover:opacity-100">Added:</span>{" "}
          <span className="opacity-30 transition duration-300 hover:opacity-100">{getWhenAdded(data.createdAt)}</span>
        </div>
      </div>

      {/* Action buttons: either quiz assessment btns or edit-delete btns */}
      <div className="flex items-start gap-x-3">
        {answer && answer.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-end">
            <div className="w-full text-right font-bold">How Well Did You Remember?</div>
            <div className="flex gap-4">
              {assessmentBtnsConfig.map((el, i) => (
                <Button
                  key={i}
                  onClick={() => registerRating(el.name)}
                  title={el.title}
                  className={`${el.classes} ${
                    ratings &&
                    ratings.length > 0 &&
                    ratings.findIndex((x) => x[0] === data.word) > -1 && // 'ratings' has this word already rated...
                    ratings.find((x) => x[0] === data.word)[1] === el.name // ...rated with this btns value
                      ? `${el.activeClasses}`
                      : ""
                  }`}
                >
                  {el.name}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={showEdit}
              className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-black active:opacity-30 opacity-50 hover:opacity-100"
              style={{ paddingTop: "0.35rem", paddingBottom: "0.35rem" }}
            >
              Edit
            </Button>

            <Button
              onClick={promptDeletion}
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-black active:opacity-30 opacity-50 hover:opacity-100"
              style={{ paddingTop: "0.35rem", paddingBottom: "0.35rem" }}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewAllEntry;

/*
{
    "img": "",
}
*/
