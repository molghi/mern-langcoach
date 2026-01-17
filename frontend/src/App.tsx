import Header from "../components/Header";
import Footer from "../components/Footer";
import AddEditForm from "../components/AddEditForm";
import ViewAll from "../components/ViewAll";
import Practice from "../components/Practice";
import FlashMessage from "../components/FlashMessage";
import BackgroundImage from "../components/BackgroundImage";
import Pagination from "../components/Pagination";
import AuthForms from "../components/AuthForms";
import { useContext, useEffect, useState } from "react";
import { Context, entriesPerPage } from "../context/MyContext";
import hotkeyHandler from "../utils/hotkeyHandler";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { getUserEntries } from "../utils/entryDbFunctions";
import useMyContext from "../hooks/useMyContext";
import ImportExport from "../components/ImportExport";

// create Layout where your Outlet (route content) will be inserted
function Layout() {
  const [content, setContent] = useState<any>(null);
  const { initFetchDone } = useMyContext();

  useEffect(() => {
    if (initFetchDone) setContent(<Outlet />); // as init fetch done, show main UI -- until then, main UI place is empty
    else setContent(null); // this all done to avoid flashing auth forms on page reload when it reads from db
  }, [initFetchDone]);

  return (
    <div className="flex flex-col min-h-[100vh] relative">
      <BackgroundImage />
      <main className="flex-1 pb-[100px]">
        <Header />
        {content}
        <FlashMessage />
        <ImportExport />
      </main>
      <Footer />
    </div>
  );
}

// ============================================================================

// main component here
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
    setEntries,
    setLanguagesAdded,
    setCategoriesAdded,
    setAllEntriesCount,
    setEntriesMatchingQueryCount,
    setIsLoggedIn,
    setUserEmail,
    setIsLoading,
    setInitFetchDone,
  } = ctx; // pull from context

  const [isOnFirstPage, setIsOnFirstPage] = useState<boolean>(true);
  const [isOnLastPage, setIsOnLastPage] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  // ============================================================================

  // init react router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/auth",
          element: <>{<AuthForms />}</>,
        },
        {
          path: "",
          element: <>{isLoggedIn ? <AddEditForm /> : <AuthForms />}</>,
        },
        {
          path: "form",
          element: <>{isLoggedIn ? <AddEditForm /> : <AuthForms />}</>,
        },
        {
          path: "view-all",
          element: (
            <>
              <ViewAll />
              {isLoggedIn && totalPages > 1 && <Pagination />}
            </>
          ),
        },
        { path: "practice", element: <Practice /> },
      ],
    },
  ]);

  // ============================================================================

  useEffect(() => {
    // check current location: if on 1st page, or if on last page
    const isShowingFilteredResults: boolean = Boolean(entriesMatchingQueryCount); // either showing filtered or unfiltered results
    const allPages: number = !isShowingFilteredResults
      ? Math.ceil(allEntriesCount / entriesPerPage)
      : Math.ceil(entriesMatchingQueryCount / entriesPerPage);
    setTotalPages(allPages);
    setIsOnFirstPage(currentPage === 1);
    setIsOnLastPage(currentPage === allPages);
  }, [entries, activeTab]);

  // ============================================================================

  useEffect(() => {
    const callback = (e: KeyboardEvent) =>
      hotkeyHandler(e, activeTab, setActiveTab, isOnFirstPage, isOnLastPage, setCurrentPage); // must be defined outside to make ref stable

    document.addEventListener("keydown", callback); // handle hotkeys

    return () => document.removeEventListener("keydown", callback); // cleanup on unmount
  }, [activeTab, isOnFirstPage, isOnLastPage]);

  // ============================================================================

  useEffect(() => {
    // attempt fetching user entries and return if authorized/logged in or not
    const initFetch = async () => {
      const pageToShow = 1;
      const filterParameter = "category_show_all";
      setIsLoading(true);
      const authorized: boolean = await getUserEntries(
        setEntries,
        setLanguagesAdded,
        setCategoriesAdded,
        setAllEntriesCount,
        setEntriesMatchingQueryCount,
        setUserEmail,
        filterParameter,
        pageToShow
      );
      setIsLoading(false);
      setInitFetchDone(true);
      if (authorized) {
        setIsLoggedIn(true);
      }
    };
    initFetch();
  }, []);

  // ============================================================================

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
