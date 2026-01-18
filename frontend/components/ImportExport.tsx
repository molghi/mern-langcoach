import Button from "./Button";
import { exportEntries, importEntries, getUserEntries } from "../utils/entryDbFunctions";
import useMyContext from "../hooks/useMyContext";
import { useRef, useEffect, useState } from "react";
import ModalWindow from "./ModalWindow";

function ImportExport() {
  const {
    isLoggedIn,
    setFlashMsgContent,
    activeTab,
    setIsLoading,
    setEntries,
    setLanguagesAdded,
    setCategoriesAdded,
    setAllEntriesCount,
    setEntriesMatchingQueryCount,
    setUserEmail,
  } = useMyContext();

  const [showModal, setShowModal] = useState(false);

  const fileImporterEl = useRef<HTMLInputElement | null>(null);

  // initiate import: open dialog window
  const initImport = () => {
    setShowModal(true);
    //     const answer = confirm(
    //       `ℹ️ Informational message:
    //
    //
    //
    //     );
    //     if (answer) fileImporterEl.current?.click();
  };

  // process input
  const reactToInput = async (e: Event) => {
    // receive file
    const input = e.target as HTMLInputElement; // html input element
    const file = input.files?.[0]; // take 1st file
    // check file existence
    if (!file) return;
    // check file type
    if (file && file.type !== "application/json") {
      return setFlashMsgContent(["error", "Only JSON files are allowed."]);
    }
    // check json file size
    if (file && file.type == "application/json" && file.size >= 5242880) {
      return setFlashMsgContent(["error", "File too large. Max 5 MB."]); // 5242880 = 5 MB
    }
    // check proper formatting: get file contents
    const rawContents = await file.text(); // string of raw contents
    const jsonized = JSON.parse(rawContents); // made json
    const validationResult = checkProperFormatting(jsonized); // check that that json has all the fields I allow
    if (validationResult === false) {
      return setFlashMsgContent(["error", "File formatted incorrectly."]);
    }
    // push to db
    if (Array.isArray(validationResult)) {
      setIsLoading(true);
      const importSuccessful = await importEntries(validationResult);
      if (importSuccessful) {
        setFlashMsgContent(["success", "Import successful!"]);
        if (activeTab === 1) {
          // re-fetch words if on View All tab
          await getUserEntries(
            setEntries,
            setLanguagesAdded,
            setCategoriesAdded,
            setAllEntriesCount,
            setEntriesMatchingQueryCount,
            setUserEmail,
            "category_show_all", // filter parameter
            1 // page to show
          );
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setFlashMsgContent(["error", "Import failed."]);
      }
    }
  };

  // ============================================================================

  useEffect(() => {
    // listen to change event on input file
    fileImporterEl.current?.addEventListener("change", (e: Event) => reactToInput(e as Event));

    return () => fileImporterEl.current?.removeEventListener("change", (e: Event) => reactToInput(e));
  }, [fileImporterEl.current]);

  // ============================================================================

  const exportFile = async () => {
    const exportData = await exportEntries();

    if (!exportData || typeof exportData === "boolean") {
      setFlashMsgContent(["error", "Exporting failed."]);
      return;
    }

    setFlashMsgContent(["success", exportData.msg]);
    downloadEntries(exportData.entries);
  };

  // ============================================================================

  // 2 btns config
  const btnsConfig: Record<string, string>[] = [
    {
      identifier: "import",
      name: "Import",
      title: "Import as JSON",
      classes: "opacity-40 hover:opacity-100 hover:bg-[antiquewhite] hover:text-black",
    },
    {
      identifier: "export",
      name: "Export",
      title: "Export as JSON",
      classes: "opacity-40 hover:opacity-100 hover:bg-[antiquewhite] hover:text-black",
    },
  ];

  // ============================================================================

  return (
    isLoggedIn && (
      <>
        <div className="flex gap-2 font-mono text-[antiquewhite] absolute sm:fixed bottom-[90px] sm:bottom-[70px] right-[10px] sm:right-[20px]">
          {/* Iterate & gen btns */}
          {btnsConfig.map((el, i) => (
            <Button
              key={i}
              onClick={el.identifier === "import" ? initImport : exportFile}
              title={el.title}
              className={el.classes}
            >
              {el.name}
            </Button>
          ))}
        </div>

        <input type="file" className="hidden" ref={fileImporterEl} />

        {showModal && (
          <ModalWindow
            title="ℹ️ Import Notice"
            text={[
              "1. Allowed files: JSON formatted exactly like exports.",
              "2. Fields mandatory for every entry: word, language, translation.",
              "3. Optional fields: definition, category, img, example, note.",
            ]}
            okayAction={() => {
              setShowModal(false);
              fileImporterEl.current?.click();
            }}
            cancelAction={() => setShowModal(false)}
          />
        )}
      </>
    )
  );
}

// ============================================================================

// helper fn
function downloadEntries(entries: any[]) {
  // Compose filename w/ current date
  const filename: string = `LangCoach-data-${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}.json`;

  // Convert array to JSON string
  const jsonString = JSON.stringify(entries, null, 2); // formatted for readability

  // Create a Blob
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary URL
  const url = URL.createObjectURL(blob);

  // Create an <a> element and trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================

// helper fn: returns either boolean false or clean arr of entry objs
function checkProperFormatting(arrOfObjs: any[]): any[] | boolean {
  if (arrOfObjs.length === 0) return false;

  // check that each arr has these properties: word, language, translation -- paramount!
  // these are secondary, allowed -- definition, category, img, example, note
  // everything else -- to filter out
  const newArr = arrOfObjs.filter((entryObj) => {
    const crucialFieldsPresent: boolean =
      Object.hasOwn(entryObj, "word") && Object.hasOwn(entryObj, "language") && Object.hasOwn(entryObj, "translation");

    if (!crucialFieldsPresent) {
      return null;
    }

    // filter out disallowed fields
    const allowedKeys = ["word", "language", "translation", "definition", "category", "img", "example", "note"];
    const entryKeys = Object.keys(entryObj);

    entryKeys.forEach((key) => {
      if (!allowedKeys.includes(key)) delete entryObj[key];
    });
    return entryObj;
  });

  if (newArr.length === 0) return false;
  else return newArr;
}

export default ImportExport;
