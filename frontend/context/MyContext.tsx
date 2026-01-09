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

// =====================================================================================================

// wrapper
export default function ContextProvider({ children }: ContextProviderProps) {
  /* fields here (2) */
  const [activeTab, setActiveTab] = useState<number>(0); // 0=Add New, 1=View All, 2=Practice
  const [entries, setEntries] = useState<EntryInterface[]>([]); // init w/ type signature; for entries fetched from db
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(true);
  const [itemInEdit, setItemInEdit] = useState<EntryInterface | null>(null);

  return (
    <Context.Provider
      value={{ activeTab, setActiveTab, entries, setEntries, isLoggedIn, setIsLoggedIn, itemInEdit, setItemInEdit }}
    >
      {children}
    </Context.Provider>
  );
}
