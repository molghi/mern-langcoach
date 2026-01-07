import { useContext } from "react";
import { Context } from "../context/MyContext";

function Header() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useContext used outside ContextProvider");
  const { activeTab, setActiveTab, isLoggedIn } = ctx;

  interface ButtonsInterface {
    name: string;
    key: string;
    specialClasses: string;
    activeClasses: string;
  }

  const buttonsConfig: ButtonsInterface[] = [
    {
      name: "Add New",
      key: "add_edit",
      specialClasses: "hover:bg-green-800",
      activeClasses: "bg-green-800",
    },
    {
      name: "View All",
      key: "view_all",
      specialClasses: "hover:bg-blue-800",
      activeClasses: "bg-blue-800",
    },
    {
      name: "Practice",
      key: "practice",
      specialClasses: "hover:bg-orange-800",
      activeClasses: "bg-orange-800",
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

    // if (key === "add_edit") {
    //   console.log("Add new or edit existing");
    // }
    // if (key === "view_all") {
    //   console.log("View all");
    // }
    // if (key === "practice") {
    //   console.log("Init practice");
    // }
    // if (key === "logout") {
    //   console.log("Log out");
    // }
  };

  // ============================================================================

  return (
    <header className="border-b border-gray-700 font-mono">
      <div className="container max-w-5xl mx-auto flex gap-x-8 gap-y-4 flex-wrap sm:flex-nowrap items-center justify-between px-6 py-4 bg-black text-[antiquewhite]">
        <div className="text-xl font-bold transition duration-300 hover:opacity-100 opacity-50">LangCoach</div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Output buttons if logged in */}
          {isLoggedIn ? (
            buttonsConfig.map((el, i) => (
              <button
                onClick={() => handleHeaderBtns(el.key, i)}
                key={el.key}
                className={`${commonClasses} ${el.specialClasses} ${activeTab === i ? el.activeClasses : ""}`}
              >
                {el.name}
              </button>
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
