import { useRef, useEffect, useState, useContext } from "react";
import { createNewEntry, getUserEntries, updateOneEntry } from "../utils/dbFunctions";
import { Context, languages } from "../context/MyContext";
import type { EntryInterface } from "../context/MyContext";
import Button from "./Button";

function AddEditForm() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage");
  const { itemInEdit, setItemInEdit, setEntries, setFlashMsgContent } = ctx;

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
  const [mode, setMode] = useState("add"); // either add or edit

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
    if (itemInEdit !== null) {
      // if edit mode
      setMode("edit");
      setWord(itemInEdit.word);
      setLanguage(itemInEdit.language);
      setTranslation(itemInEdit.translation);
      setDefinition(itemInEdit.definition);
      setCategory(itemInEdit.category);
      setImg(itemInEdit.img);
      setExample(itemInEdit.example);
      setNote(itemInEdit.note);
    }

    if (itemInEdit === null) {
      // if add mode
      setMode("add");
      setWord("");
      setLanguage(languages[0].key);
      setTranslation("");
      setDefinition("");
      setCategory("");
      setImg("");
      setExample("");
      setNote("");
    }

    firstFieldRef.current?.focus(); // focus first field
  }, [itemInEdit]);

  // ============================================================================

  // submit either Add or Edit form
  const submitForm = async (e: React.FormEvent<HTMLFormElement>, mode: string) => {
    e.preventDefault();
    const newEntry: EntryInterface = { word, language, translation, definition, category, img, example, note };

    if (mode === "add") {
      await createNewEntry(newEntry, setError, setFlashMsgContent); // add to db
      // reset fields
      setWord("");
      setLanguage(languages[0].key);
      setTranslation("");
      setDefinition("");
      setCategory("");
      setImg("");
      setExample("");
      setNote("");
      // focus first field
      firstFieldRef.current?.focus();
    }

    if (mode === "edit") {
      if (itemInEdit !== null) newEntry._id = itemInEdit._id;
      const isUpdateSuccessful = await updateOneEntry(newEntry, setError, setFlashMsgContent);
      // if (isUpdateSuccessful) getUserEntries(setEntries); // no need to do that since I'm on tab 1
      if (isUpdateSuccessful) setItemInEdit(null); // switch mode back to Add
    }
  };

  // ============================================================================

  return (
    <div className="font-mono max-w-[700px] mx-auto px-4 md:px-0">
      {/* Title */}
      <h1 className="text-[antiquewhite] text-center my-10 font-bold text-2xl [@media(min-width:540px)]:text-3xl">
        <span className="bg-black/50 rounded-[5px] px-4 py-1.5">
          {mode.slice(0, 1).toUpperCase() + mode.slice(1).toLowerCase()} Word / Phrase
        </span>{" "}
      </h1>

      {/* Iterate and Generate Fields */}
      <form onSubmit={(e) => submitForm(e, mode)}>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4 sm:gap-y-8 mb-10">
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
                  className="bg-black/50 font-inherit text-inherit px-4 py-2 cursor-pointer border border-[antiquewhite] rounded-md transition duration-200 text-white focus:shadow-[0_0_15px_antiquewhite]"
                />
              ) : (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  id={el.key}
                  className="min-h-[42px] bg-black/50 font-inherit px-2 py-2 cursor-pointer border border-[antiquewhite] rounded-md transition duration-200 focus:shadow-[0_0_15px_antiquewhite] text-[antiquewhite]"
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
          <Button
            type="submit"
            className="min-w-[100%] sm:min-w-[100px] px-[15px] py-[10px] hover:text-black hover:bg-[antiquewhite] tracking-wider active:opacity-50 bg-black/50"
            style={{ fontSize: "18px", borderColor: "antiquewhite" }}
          >
            {mode.toUpperCase()}
          </Button>
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
