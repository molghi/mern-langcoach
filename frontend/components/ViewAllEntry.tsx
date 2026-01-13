import { languages, languageColors } from "../context/MyContext";
import useMyContext from "../hooks/useMyContext";
import { deleteOneEntry, getUserEntries } from "../utils/dbFunctions";
import type { EntryInterface } from "../context/MyContext"; // import as type
import Button from "./Button";

interface Props {
  data: EntryInterface;
}

function ViewAllEntry({ data }: Props) {
  const {
    setItemInEdit,
    setActiveTab,
    setEntries,
    setFlashMsgContent,
    setLanguagesAdded,
    setCategoriesAdded,
    setAllEntriesCount,
    setEntriesMatchingQueryCount,
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
      const deletedSuccessfully = await deleteOneEntry(data._id, setFlashMsgContent);
      if (deletedSuccessfully)
        await getUserEntries(
          setEntries,
          setLanguagesAdded,
          setCategoriesAdded,
          setAllEntriesCount,
          setEntriesMatchingQueryCount
        );
    }
  };

  // ============================================================================

  return (
    <div
      className={`border border-[${languageColors[data.language]}] text-[${
        languageColors[data.language]
      }] rounded-lg p-4 bg-black/40 flex gap-4 justify-between hover:bg-black/70 flex-col sm:flex-row word-entry-block`}
    >
      {/* Fields */}
      <div className="flex flex-col gap-2">
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
          <span className="translation">{data.translation}</span>
        </div>

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
            <span className="font-bold opacity-30">Web Img:</span>{" "}
            <img alt="Web Image" src={data.img} className="max-w-[200px] object-contain" />
          </div>
        )}

        {/* Created at */}
        <div className="text-[12px] transition duration-200 opacity-70 hover:opacity-100">
          <span className="font-bold opacity-30 transition duration-300 hover:opacity-100">Added:</span>{" "}
          <span className="opacity-30 transition duration-300 hover:opacity-100">{getWhenAdded(data.createdAt)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-start gap-x-3">
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
