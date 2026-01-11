import Header from "../components/Header";
import Footer from "../components/Footer";
import AddEditForm from "../components/AddEditForm";
import ViewAll from "../components/ViewAll";
import Practice from "../components/Practice";
import FlashMessage from "../components/FlashMessage";
import BackgroundImage from "../components/BackgroundImage";
import Pagination from "../components/Pagination";
import { useContext, useEffect, useState } from "react";
import { Context, entriesPerPage } from "../context/MyContext";
import hotkeyHandler from "../utils/hotkeyHandler";

function App() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage");
  const {
    activeTab,
    isLoggedIn,
    setActiveTab,
    entries,
    currentPage,
    setCurrentPage,
    allEntriesCount,
    entriesMatchingQueryCount,
  } = ctx; // pull from context

  const [isOnFirstPage, setIsOnFirstPage] = useState<boolean>(true);
  const [isOnLastPage, setIsOnLastPage] = useState<boolean>(false);

  useEffect(() => {
    // check current location: if on 1st page, if on last page
    const isShowingFilteredResults: boolean = Boolean(entriesMatchingQueryCount); // either showing filtered or unfiltered results
    const totalPages: number = !isShowingFilteredResults
      ? Math.ceil(allEntriesCount / entriesPerPage)
      : Math.ceil(entriesMatchingQueryCount / entriesPerPage);
    setIsOnFirstPage(currentPage === 1);
    setIsOnLastPage(currentPage === totalPages);
  }, [entries, activeTab]);

  useEffect(() => {
    // handle hotkeys
    document.addEventListener("keydown", (e) =>
      hotkeyHandler(e, activeTab, setActiveTab, isOnFirstPage, isOnLastPage, setCurrentPage)
    );
    // cleanup on unmount
    return () => {
      document.removeEventListener("keydown", (e) =>
        hotkeyHandler(e, activeTab, setActiveTab, isOnFirstPage, isOnLastPage, setCurrentPage)
      );
    };
  }, [activeTab]);

  return (
    <div className="flex flex-col min-h-[100vh] relative">
      <BackgroundImage />

      <main className="flex-1 pb-[100px]">
        <Header />

        {isLoggedIn && activeTab === 0 && <AddEditForm />}

        {isLoggedIn && activeTab === 1 && <ViewAll />}

        {isLoggedIn && activeTab === 2 && <Practice />}

        <FlashMessage />

        {isLoggedIn && activeTab === 1 && <Pagination />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
