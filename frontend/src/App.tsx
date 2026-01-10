import Header from "../components/Header";
import Footer from "../components/Footer";
import AddEditForm from "../components/AddEditForm";
import ViewAll from "../components/ViewAll";
import Practice from "../components/Practice";
import FlashMessage from "../components/FlashMessage";
import BackgroundImage from "../components/BackgroundImage";
import Pagination from "../components/Pagination";
import { useContext } from "react";
import { Context } from "../context/MyContext";

function App() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage");
  const { activeTab, isLoggedIn, setBgImg, allEntriesCount } = ctx; // pull from context
  const entriesPerPage = 5;

  return (
    <div className="flex flex-col min-h-[100vh] relative">
      <BackgroundImage />

      <main className="flex-1 pb-[100px]">
        <Header />

        {isLoggedIn && activeTab === 0 && <AddEditForm />}

        {isLoggedIn && activeTab === 1 && <ViewAll />}

        {isLoggedIn && activeTab === 2 && <Practice />}

        <FlashMessage />

        {isLoggedIn && activeTab === 1 && allEntriesCount > entriesPerPage && <Pagination />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
