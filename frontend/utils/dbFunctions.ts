import axios from "axios";
import type { EntryInterface } from "../context/MyContext"; // import as type

// ============================================================================

// create one new entry
async function createNewEntry(newEntryObj: EntryInterface, setError: React.Dispatch<React.SetStateAction<string>>) {
  try {
    const response = await axios.post("http://localhost:8000/entries", newEntryObj);

    if (response.status === 200) {
      console.log("created nicely!");
    }
  } catch (error) {
    console.log("🛑 ERROR:", error);
    // setError(error);
  }
}

// ============================================================================

// get all user entries
async function getUserEntries(setEntries: React.Dispatch<React.SetStateAction<EntryInterface[]>>) {
  try {
    const response = await axios.get("http://localhost:8000/entries");

    if (response.status === 200) {
      setEntries(response.data.entries);
    }
  } catch (error) {
    console.log("🛑 ERROR:", error);
    // setError(error);
  }
}

// ============================================================================

export { createNewEntry, getUserEntries };
