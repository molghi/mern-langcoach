import axios from "axios";
import type { EntryInterface } from "../context/MyContext"; // import as type

// ============================================================================

// create one new entry
async function createNewEntry(newEntryObj: EntryInterface, setError: React.Dispatch<React.SetStateAction<string>>) {
  try {
    const response = await axios.post("http://localhost:8000/entries", newEntryObj);

    if (response.status === 200) {
      console.log("Created nicely!");
    }
  } catch (error) {
    console.log("🛑 ERROR:", error);
    // setError(error);
  }
}

// ============================================================================

// get all user entries
async function getUserEntries(
  setEntries: React.Dispatch<React.SetStateAction<EntryInterface[]>>,
  setLanguagesAdded: React.Dispatch<React.SetStateAction<string[]>>,
  setCategoriesAdded: React.Dispatch<React.SetStateAction<string[]>>,
  parameter?: string
) {
  try {
    if (!parameter) {
      // if no parameter -> fetching all, without filtering anything
      const response = await axios.get("http://localhost:8000/entries");

      if (response.status === 200) {
        // set entries
        setEntries(response.data.entries);

        // set quick summary for filter in View All
        setLanguagesAdded(response.data.languagesAdded.map((x: { _id: string }) => x._id).filter((x: any) => x.trim())); // get what langs are added
        setCategoriesAdded(
          response.data.categoriesAdded.map((x: { _id: string }) => x._id).filter((x: any) => x.trim())
        ); // get what categories are added
      }
    } else {
      // if parameter exists, fetch & filter by certain field
      const response = await axios.get(`http://localhost:8000/entries?filter=${parameter}`);

      if (response.status === 200) {
        // set entries
        setEntries(response.data.entries);

        // set quick summary for filter in View All
        setLanguagesAdded(response.data.languagesAdded.map((x: { _id: string }) => x._id).filter((x: any) => x.trim())); // get what langs are added
        setCategoriesAdded(
          response.data.categoriesAdded.map((x: { _id: string }) => x._id).filter((x: any) => x.trim())
        ); // get what categories are added
      }
    }
  } catch (error) {
    console.log("🛑 ERROR:", error);
    // setError(error);
  }
}

// ============================================================================

// update one entry
async function updateOneEntry(entryObj: EntryInterface, setError: React.Dispatch<React.SetStateAction<string>>) {
  try {
    const response = await axios.patch("http://localhost:8000/entries", entryObj);

    if (response.status === 200) {
      console.log("Updated nicely!");
      return true;
    }
    return false;
  } catch (error) {
    console.log("🛑 ERROR:", error);
    // setError(error);
    return false;
  }
}

// ============================================================================

// delete one entry
async function deleteOneEntry(idToDelete: string | number) {
  try {
    const response = await axios.delete(`http://localhost:8000/entries?id=${idToDelete}`);

    if (response.status === 200) {
      console.log("Deleted nicely!");
      return true;
    }
    return false;
  } catch (error) {
    console.log("🛑 ERROR:", error);
    // setError(error);
    return false;
  }
}

// ============================================================================

export { createNewEntry, getUserEntries, updateOneEntry, deleteOneEntry };
