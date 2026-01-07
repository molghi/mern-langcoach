import Header from "../components/Header";
import Footer from "../components/Footer";
import AddEditForm from "../components/AddEditForm";
import ViewAll from "../components/ViewAll";
import Practice from "../components/Practice";
import { useContext } from "react";
import { Context } from "../context/MyContext";

function App() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Incorrect context usage");
  const { activeTab, isLoggedIn } = ctx; // pull from context

  return (
    <div className="flex flex-col min-h-[100vh]">
      <main className="flex-1 pb-[100px]">
        <Header />

        {isLoggedIn && activeTab === 0 && <AddEditForm />}

        {isLoggedIn && activeTab === 1 && <ViewAll />}

        {isLoggedIn && activeTab === 2 && <Practice />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
