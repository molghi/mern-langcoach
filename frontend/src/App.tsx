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
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// create Layout where your Outlet (route content) will be inserted
function Layout() {
  return (
    <div className="flex flex-col min-h-[100vh] relative">
      <BackgroundImage />
      <main className="flex-1 pb-[100px]">
        <Header />
        <Outlet /> {/* child routes here */}
        <FlashMessage />
      </main>
      <Footer />
    </div>
  );
}

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
  const [totalPages, setTotalPages] = useState<number>(0);

  // init react router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <AddEditForm /> },
        { path: "form", element: <AddEditForm /> },
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

  useEffect(() => {
    const callback = (e: KeyboardEvent) =>
      hotkeyHandler(e, activeTab, setActiveTab, isOnFirstPage, isOnLastPage, setCurrentPage); // must be defined outside to make ref stable

    document.addEventListener("keydown", callback); // handle hotkeys

    return () => document.removeEventListener("keydown", callback); // cleanup on unmount
  }, [activeTab, isOnFirstPage, isOnLastPage]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
