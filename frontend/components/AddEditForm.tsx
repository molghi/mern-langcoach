import { useRef, useEffect, useState } from "react";
import { createNewEntry } from "../utils/dbFunctions";
import { languages } from "../context/MyContext";

function AddEditForm() {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState(languages[0].key);
  const [translation, setTranslation] = useState("");
  const [definition, setDefinition] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState("");
  const [example, setExample] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(""); // for validation errors

  // get field value
  const fieldGetter = (key: string) => {
    switch (key) {
      case "word":
        return word;
      case "language":
        return language;
      case "translation":
        return translation;
      case "definition":
        return definition;
      case "category":
        return category;
      case "img":
        return img;
      case "example":
        return example;
      case "note":
        return note;
      default:
        break;
    }
  };

  // set field value
  const fieldSetter = (newValue: string, key: string) => {
    switch (key) {
      case "word":
        setWord(newValue);
        break;
      case "language":
        setLanguage(newValue);
        break;
      case "translation":
        setTranslation(newValue);
        break;
      case "definition":
        setDefinition(newValue);
        break;
      case "category":
        setCategory(newValue);
        break;
      case "img":
        setImg(newValue);
        break;
      case "example":
        setExample(newValue);
        break;
      case "note":
        setNote(newValue);
        break;
      default:
        break;
    }
  };

  // ============================================================================

  interface FieldsInterface {
    title: string;
    key: string;
    required: boolean;
    type: string;
  }

  // fields general config
  const fieldsConfig: FieldsInterface[] = [
    { title: "Word / Phrase", required: true, type: "input", key: "word" },
    { title: "Language", required: true, type: "select", key: "language" },
    { title: "Translation", required: true, type: "input", key: "translation" },
    { title: "Definition / Tip", required: false, type: "input", key: "definition" },
    { title: "Category / Tag", required: false, type: "input", key: "category" },
    { title: "Web Img Path", required: false, type: "input", key: "img" },
    { title: "Example Usage", required: false, type: "input", key: "example" },
    { title: "Note", required: false, type: "input", key: "note" },
  ];

  useEffect(() => {
    firstFieldRef.current?.focus(); // focus first field
  }, []);

  // ============================================================================

  // submit either Add or Edit form
  const submitForm = async (e: React.FormEvent<HTMLFormElement>, mode: string) => {
    e.preventDefault();
    const newEntry = { word, language, translation, definition, category, img, example, note };

    if (mode === "add") {
      await createNewEntry(newEntry, setError);
    }
    if (mode === "edit") {
      console.log("edit entry req");
    }
  };

  // ============================================================================

  return (
    <div className="font-mono max-w-[700px] mx-auto">
      {/* Title */}
      <h1 className="text-[antiquewhite] text-center my-10 font-bold text-3xl">
        <span className="bg-black/50 rounded-[5px] px-4 py-1.5"> Add Word / Phrase</span>{" "}
      </h1>

      {/* Iterate and Generate Fields */}
      <form onSubmit={(e) => submitForm(e, "add")}>
        <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-10">
          {fieldsConfig.map((el, i) => (
            <div key={i} className="flex flex-col gap-[5px]">
              <label
                htmlFor={el.key}
                className="text-[antiquewhite] opacity-60 text-sm transition duration-200 hover:opacity-100"
              >
                {el.title}
                {` `}
                {el.required ? <span style={{ color: "red" }}>*</span> : ""}
              </label>
              {el.type === "input" ? (
                <input
                  ref={i === 0 ? firstFieldRef : null}
                  value={fieldGetter(el.key)}
                  onChange={(e) => fieldSetter(e.target.value, el.key)}
                  required={el.required}
                  autoComplete="off"
                  type="text"
                  id={el.key}
                  className="bg-black/50 font-inherit bg-inherit text-inherit px-4 py-2 cursor-pointer border border-[antiquewhite] rounded-md transition duration-200 text-white focus:shadow-[0_0_15px_antiquewhite]"
                />
              ) : (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  id={el.key}
                  className="min-h-[42px] bg-black/50 font-inherit bg-inherit px-2 py-2 cursor-pointer border border-[antiquewhite] rounded-md transition duration-200 focus:shadow-[0_0_15px_antiquewhite] text-[antiquewhite]"
                >
                  {languages.map((el, i) => (
                    <option value={el.key} key={i}>
                      {el.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-right">
          <button
            type="submit"
            className="border border-[antiquewhite] text-[antiquewhite] text-[18px] min-w-[100px] px-[15px] py-[10px] rounded-xl transition duration-300 uppercase hover:text-black hover:bg-[antiquewhite] tracking-wider active:opacity-50"
          >
            Add
          </button>
        </div>
      </form>

      {error && (
        <div className="text-[red] p-4 border border-[red] rounded-md mt-8">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}
    </div>
  );
}

export default AddEditForm;
