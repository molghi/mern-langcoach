import Button from "./Button";
import { exportEntries } from "../utils/entryDbFunctions";
import useMyContext from "../hooks/useMyContext";

function ImportExport() {
  const { isLoggedIn, setFlashMsgContent } = useMyContext();

  const importFile = () => {
    console.log("import");
  };

  const exportFile = async () => {
    const exportData = await exportEntries(); // bitchign about exportData

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
      <div className="flex gap-2 font-mono text-[antiquewhite] absolute sm:fixed bottom-[90px] sm:bottom-[70px] right-[10px] sm:right-[20px]">
        {/* Iterate & gen btns */}
        {btnsConfig.map((el, i) => (
          <Button
            key={i}
            onClick={el.identifier === "import" ? importFile : exportFile}
            title={el.title}
            className={el.classes}
          >
            {el.name}
          </Button>
        ))}
      </div>
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

export default ImportExport;
