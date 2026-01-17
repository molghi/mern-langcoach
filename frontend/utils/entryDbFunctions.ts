import axios from "axios";
import type { EntryInterface } from "../context/MyContext"; // import as type

// ============================================================================

// create one new entry
async function createNewEntry(
  newEntryObj: EntryInterface,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setFlashMsgContent: React.Dispatch<React.SetStateAction<[string, string]>>
) {
  try {
    const response = await axios.post("http://localhost:8000/entries", newEntryObj);

    if (response.status === 200) {
      setFlashMsgContent(["success", "Word added!"]);
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
  setAllEntriesCount: React.Dispatch<React.SetStateAction<number>>,
  setEntriesMatchingQueryCount: React.Dispatch<React.SetStateAction<number>>,
  setUserEmail: React.Dispatch<React.SetStateAction<string>>,
  parameter?: string,
  page: number = 1
) {
  try {
    const filterQuery = !parameter ? "" : `filter=${parameter}&`;
    // if no parameter --> fetch all, without filtering anything
    // if parameter exists --> fetch & filter by certain field

    axios.defaults.withCredentials = true;
    const response = await axios.get(`http://localhost:8000/entries?${filterQuery}page=${page}`);

    if (response.status === 200) {
      setEntries(response.data.entries); // not all words but only currently paginated/portioned
      setAllEntriesCount(response.data.allEntriesCount); // TOTAL words count that user has
      setEntriesMatchingQueryCount(response.data.entriesMatchingQueryCount); // count for: words matching current filter query
      setUserEmail(response.data.email);

      // set quick summary for filter in View All
      setLanguagesAdded(response.data.languagesAdded.map((x: { _id: string }) => x._id).filter((x: any) => x.trim())); // get what langs are added
      setCategoriesAdded(response.data.categoriesAdded.map((x: { _id: string }) => x._id).filter((x: any) => x.trim())); // get what categories are added

      return true; // meaning authorized, logged in, there is a jwt cookie
    }
    return false;
  } catch (error) {
    console.log("🛑 ERROR:", error);
    // setError(error);
    return false;
  }
}

// ============================================================================

// update one entry
async function updateOneEntry(
  entryObj: EntryInterface,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setFlashMsgContent: React.Dispatch<React.SetStateAction<[string, string]>>
) {
  try {
    const response = await axios.patch("http://localhost:8000/entries", entryObj);

    if (response.status === 200) {
      setFlashMsgContent(["success", "Word updated!"]);
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
async function deleteOneEntry(
  idToDelete: string | number,
  setFlashMsgContent: React.Dispatch<React.SetStateAction<[string, string]>>
) {
  try {
    const response = await axios.delete(`http://localhost:8000/entries?id=${idToDelete}`);

    if (response.status === 200) {
      setFlashMsgContent(["success", "Word deleted!"]);
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

async function getAddedLangs(setAddedLangs: React.Dispatch<React.SetStateAction<string[]>>) {
  try {
    const response = await axios.get(`http://localhost:8000/languages`);
    setAddedLangs(response.data.languages.map((x: any) => x._id));
  } catch (error) {
    console.log("🛑 ERROR:", error);
  }
}

// ============================================================================

async function fetchPracticeRounds(
  chosenPracticeLanguage: string,
  setCurrentPractice: React.Dispatch<React.SetStateAction<EntryInterface[]>>
) {
  try {
    const response = await axios.get(`http://localhost:8000/practice?language=${chosenPracticeLanguage}`);
    if (response.status === 200) setCurrentPractice(response.data.rounds);
  } catch (error) {
    console.log("🛑 ERROR:", error);
  }
}

// ============================================================================

// implement spaced repetition and save to db
async function saveQuizResults(currentPractice: EntryInterface[], ratings: any[]) {
  // calc spacedRep nextDateRevision -- and update db with it
  const idAndNextRevision: Record<string, string> = {};
  const now = new Date().getTime();
  currentPractice.forEach((roundObj) => {
    const currentRating = ratings.find((entry) => entry[0] === roundObj.word)[1];
    let nextRevDate = now;

    switch (currentRating) {
      case "Fail":
        nextRevDate = now + 5 * 60 * 1000; // 5 min in secs
        break;
      case "Hard":
        nextRevDate = now + 30 * 60 * 1000; // 30 min in secs
        break;
      case "Good":
        nextRevDate = now + 24 * 60 * 60 * 1000; // 24 hrs (1 day) in secs
        break;
      case "Easy":
        nextRevDate = now + 5 * 24 * 60 * 60 * 1000; // 5 days in secs
        break;
      default:
        break;
    }

    if (roundObj._id) {
      idAndNextRevision[roundObj._id.toString()] = String(nextRevDate);
    }
  });

  try {
    const response = await axios.patch("http://localhost:8000/entries_quiz", { data: idAndNextRevision });
    if (response.status === 200) return true;
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// ============================================================================

interface ReturnedExport {
  msg: string;
  entries: any[];
}

// returns either arr of data - or boolean: meaning it failed
async function exportEntries(): Promise<ReturnedExport | boolean> {
  try {
    const response = await axios.get("http://localhost:8000/export");

    if (response.status === 200) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// ============================================================================

async function importEntries(entries: EntryInterface[]): Promise<boolean> {
  try {
    const response = await axios.post("http://localhost:8000/import", { entries });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// ============================================================================

export {
  createNewEntry,
  getUserEntries,
  updateOneEntry,
  deleteOneEntry,
  getAddedLangs,
  fetchPracticeRounds,
  saveQuizResults,
  exportEntries,
  importEntries,
};
