import { useContext, useEffect } from "react";
import { Context } from "../context/MyContext";
import Button from "./Button";

function Header() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useContext used outside ContextProvider");
  const { activeTab, setActiveTab, isLoggedIn, itemInEdit, setItemInEdit, setCurrentPage } = ctx;

  interface ButtonsInterface {
    name: string;
    key: string;
    specialClasses: string;
    activeClasses: string;
    title?: string;
  }

  const buttonsConfig: ButtonsInterface[] = [
    {
      name: "Add New",
      key: "add_edit",
      specialClasses: "hover:bg-green-800",
      activeClasses: "bg-green-800",
      title: "Or press Ctrl + 1",
    },
    {
      name: "View All",
      key: "view_all",
      specialClasses: "hover:bg-blue-800",
      activeClasses: "bg-blue-800",
      title: "Or press Ctrl + 2",
    },
    {
      name: "Practice",
      key: "practice",
      specialClasses: "hover:bg-orange-800",
      activeClasses: "bg-orange-800",
      title: "Or press Ctrl + 3",
    },
    {
      name: "Logout",
      key: "logout",
      specialClasses: "bg-gray-800 opacity-40 hover:opacity-100",
      activeClasses: "",
    },
  ];

  const commonClasses: string =
    "px-4 py-2 text-sm font-semibold rounded-md transition duration-200 border border-gray-600";

  // ============================================================================

  // handle clicks on header btns
  const handleHeaderBtns = (key: string, index: number) => {
    if (!buttonsConfig.map((x) => x.key).includes(key)) return; // if it's not a defined config action, stop

    setActiveTab(index);

    setItemInEdit(null); // if header btn was clicked, always set 1st btn to "Add New" - 1st btn is only "Edit One" if it was clicked to edit in "View All"

    if (key === "logout") {
      console.log("Log out");
    }
  };

  // ============================================================================

  useEffect(() => {
    // change doc title
    if (activeTab === 0) {
      document.title = `LangCoach — Word Form`;
    }
    if (activeTab === 1) {
      document.title = `LangCoach — Your Words`;
      setCurrentPage(1);
    }
    if (activeTab === 2) {
      document.title = `LangCoach — Practice`;
    }
  }, [activeTab]);

  // ============================================================================

  return (
    <header className="font-mono bg-black/50">
      <div className="container max-w-5xl mx-auto flex gap-x-8 gap-y-4 flex-wrap sm:flex-nowrap items-center justify-between px-6 py-4 text-[antiquewhite]">
        <div className="text-xl font-bold transition duration-300 hover:opacity-100 opacity-50">LangCoach</div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Output buttons if logged in */}
          {isLoggedIn ? (
            buttonsConfig.map((el, i) => (
              <Button
                key={el.key}
                onClick={() => handleHeaderBtns(el.key, i)}
                className={`${commonClasses} ${el.specialClasses} ${activeTab === i ? el.activeClasses : ""}`}
                title={el.title}
              >
                {itemInEdit !== null && i === 0 ? "Edit One" : el.name}
              </Button>
            ))
          ) : (
            <span className="transition duration-200 opacity-50 hover:opacity-100">Please sign in to use the app</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
