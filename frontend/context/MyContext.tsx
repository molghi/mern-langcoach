import { createContext, useState } from "react";
import type { ReactNode } from "react"; // type-only import to satisfy TS

// define 'children' type
interface ContextProviderProps {
  children: ReactNode;
}

// define word entry fields
export interface EntryInterface {
  word: string;
  language: string;
  translation: string;
  definition: string;
  category: string;
  img: string;
  example: string;
  note: string;
  _id?: number | string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContextInterface {
  /* fields here (1) */
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  entries: EntryInterface[];
  setEntries: React.Dispatch<React.SetStateAction<EntryInterface[]>>;
  isLoggedIn: Boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
  itemInEdit: EntryInterface | null;
  setItemInEdit: React.Dispatch<React.SetStateAction<EntryInterface | null>>;
  isLoading: Boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>;
  flashMsgContent: [string, string];
  setFlashMsgContent: React.Dispatch<React.SetStateAction<[string, string]>>;
  languagesAdded: string[];
  setLanguagesAdded: React.Dispatch<React.SetStateAction<string[]>>;
  whenAdded: string[];
  setWhenAdded: React.Dispatch<React.SetStateAction<string[]>>;
  categoriesAdded: string[];
  setCategoriesAdded: React.Dispatch<React.SetStateAction<string[]>>;
  bgImg: string;
  setBgImg: React.Dispatch<React.SetStateAction<string>>;
  allEntriesCount: number;
  setAllEntriesCount: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  entriesMatchingQueryCount: number;
  setEntriesMatchingQueryCount: React.Dispatch<React.SetStateAction<number>>;
  chosenPracticeLanguage: string;
  setChosenPracticeLanguage: React.Dispatch<React.SetStateAction<string>>;
  currentPractice: EntryInterface[];
  setCurrentPractice: React.Dispatch<React.SetStateAction<EntryInterface[]>>;
  currentPracticeCounter: number;
  setCurrentPracticeCounter: React.Dispatch<React.SetStateAction<number>>;
  quizAnswers: string[];
  setQuizAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

// my context
export const Context = createContext<ContextInterface | null>(null);

// available language options
export const languages: { name: string; key: string }[] = [
  { name: "🇨🇱 Español", key: "spanish" },
  { name: "🇪🇬 el-'arabiyya (العربية)", key: "arabic" },
  { name: "🇩🇪 Deutsch", key: "german" },
  { name: "🇫🇷 Français", key: "french" },
  { name: "🇨🇳 zhōng wén (中文)", key: "chinese" },
  { name: "🇮🇸 Íslenska", key: "icelandic" },
  { name: "🇹🇷 Türkçe", key: "turkish" },
  { name: "🇨🇿 Čeština", key: "czech" },
  { name: "🇺🇸 English", key: "english" },
  { name: "🇷🇺 Russkij (Русский)", key: "russian" },
  { name: "🇯🇵 nihongo (日本語)", key: "japanese" },
  // { name: "🇧🇷 Português", key: "portuguese" },
  // { name: "🇮🇹 Italiano", key: "italian" },
];

// colors associated with languages
export const languageColors: Record<string, string> = {
  spanish: "gold",
  arabic: "green",
  german: "coral",
  french: "dodgerblue",
  chinese: "salmon",
  icelandic: "cyan",
  turkish: "red",
  czech: "#C060B9",
  english: "#B22C4F",
  russian: "MistyRose",
  japanese: "#F0FFA5",
};

// available choice for an animated bg
export const availableBGs = {
  "Snowing in the dusk": "snowing-in-the-dusk.gif",
  // "snow-in-the-dark.gif": "snow-in-the-dark.gif",
  "Heavy snow": "heavy-snow.gif",
  "Snowing in the forest 2": "snowing-in-the-forest-2.gif",
  "Snowing in the forest": "snowing-in-the-forest.gif",
  "Snowy forest": "snowy-forest.gif",
  "Snow lamppost": "snow-lamppost.gif",
  "Snowing top": "snowing-top.gif",
  "Snowy overcast": "snowy-overcast.gif",
  "Snow trees": "snow-trees.gif",
  "Snow black": "snow-black.gif",
  "Snowy day": "snowy-day.gif",
  // "Snowy day 2":"snowy-day-2.gif",
  // "Snowy day 3":"snowy-day-3.gif",
};

export const localStorageBgKey: string = "langcoach_bg";
export const entriesPerPage: number = 5;

// =====================================================================================================

// wrapper
export default function ContextProvider({ children }: ContextProviderProps) {
  /* fields here (2) */
  const [activeTab, setActiveTab] = useState<number>(0); // 0=Add New, 1=View All, 2=Practice
  const [entries, setEntries] = useState<EntryInterface[]>([]); // init w/ type signature; for entries fetched from db
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
  const [itemInEdit, setItemInEdit] = useState<EntryInterface | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [flashMsgContent, setFlashMsgContent] = useState<[string, string]>(["", ""]); // 1st str: msg type, 2nd str: msg text
  const [languagesAdded, setLanguagesAdded] = useState<string[]>([]); // arr of added langs
  const [whenAdded, setWhenAdded] = useState<string[]>([]); // arr of yyyy-mm periods
  const [categoriesAdded, setCategoriesAdded] = useState<string[]>([]); // arr of added categories
  const [bgImg, setBgImg] = useState<string>(""); // animated bg
  const [allEntriesCount, setAllEntriesCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesMatchingQueryCount, setEntriesMatchingQueryCount] = useState<number>(0);
  const [chosenPracticeLanguage, setChosenPracticeLanguage] = useState<string>("");
  const [currentPractice, setCurrentPractice] = useState<EntryInterface[]>([]); // current practice rounds
  const [currentPracticeCounter, setCurrentPracticeCounter] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  return (
    <Context.Provider
      value={{
        activeTab,
        setActiveTab,
        entries,
        setEntries,
        isLoggedIn,
        setIsLoggedIn,
        itemInEdit,
        setItemInEdit,
        isLoading,
        setIsLoading,
        flashMsgContent,
        setFlashMsgContent,
        languagesAdded,
        setLanguagesAdded,
        whenAdded,
        setWhenAdded,
        categoriesAdded,
        setCategoriesAdded,
        bgImg,
        setBgImg,
        allEntriesCount,
        setAllEntriesCount,
        currentPage,
        setCurrentPage,
        entriesMatchingQueryCount,
        setEntriesMatchingQueryCount,
        chosenPracticeLanguage,
        setChosenPracticeLanguage,
        currentPractice,
        setCurrentPractice,
        currentPracticeCounter,
        setCurrentPracticeCounter,
        quizAnswers,
        setQuizAnswers,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </Context.Provider>
  );
}
