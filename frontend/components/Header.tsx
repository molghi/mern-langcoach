import { useEffect } from "react";
import Button from "./Button";
import { NavLink, useNavigate } from "react-router-dom";
import useMyContext from "../hooks/useMyContext";
import { logOut } from "../utils/userDbFunctions";

function Header() {
  const {
    activeTab,
    setActiveTab,
    isLoggedIn,
    itemInEdit,
    setItemInEdit,
    setCurrentPage,
    setCurrentPractice,
    setCurrentPracticeCounter,
    userEmail,
    setIsLoggedIn,
    setFlashMsgContent,
  } = useMyContext();

  const navigate = useNavigate();

  interface ButtonsInterface {
    name: string;
    key: string;
    specialClasses: string;
    activeClasses: string;
    title?: string;
    link?: string;
  }

  // ============================================================================

  const buttonsConfig: ButtonsInterface[] = [
    {
      name: "Add New",
      key: "add_edit",
      specialClasses: "hover:bg-green-800",
      activeClasses: "bg-green-800",
      title: "Or press Ctrl + 1",
      link: "form",
    },
    {
      name: "View All",
      key: "view_all",
      specialClasses: "hover:bg-blue-800",
      activeClasses: "bg-blue-800",
      title: "Or press Ctrl + 2",
      link: "view-all",
    },
    {
      name: "Practice",
      key: "practice",
      specialClasses: "hover:bg-orange-800",
      activeClasses: "bg-orange-800",
      title: "Or press Ctrl + 3",
      link: "practice",
    },
    {
      name: "Logout",
      key: "logout",
      specialClasses: "bg-gray-800 opacity-40 hover:opacity-100",
      activeClasses: "",
      title: `Logged in as ${userEmail || "..."}`,
    },
  ];

  const commonClasses: string = "font-semibold rounded-md transition duration-200 border border-gray-600";

  // ============================================================================

  // handle clicks on header btns
  const handleHeaderBtns = async (key: string, index: number) => {
    if (!buttonsConfig.map((x) => x.key).includes(key)) return; // if it's not a defined config action, stop

    setActiveTab(index);

    setItemInEdit(null); // if header btn was clicked, always set 1st btn to "Add New" - 1st btn is only "Edit One" if it was clicked to edit in "View All"

    if (key === "logout") {
      const logoutSuccessful: boolean = await logOut();
      if (logoutSuccessful) {
        setIsLoggedIn(false);
        setFlashMsgContent(["success", "Logged out!"]);
      }
    }
  };

  // ============================================================================

  useEffect(() => {
    // change doc title
    if (activeTab === 0) {
      document.title = `LangCoach — Word Form`;
      navigate("/form");
    }
    if (activeTab === 1) {
      document.title = `LangCoach — Your Words`;
      setCurrentPage(1);
      navigate("/view-all");
    }
    if (activeTab === 2) {
      document.title = `LangCoach — Practice`;
      setCurrentPractice([]); // if switching to Practice and there was some practice, it resets
      setCurrentPracticeCounter(0);
      navigate("/practice");
    }
  }, [activeTab]);

  // ============================================================================

  return (
    <header className="font-mono bg-black/50">
      <div className="container max-w-5xl mx-auto flex gap-x-8 gap-y-4 flex-wrap sm:flex-nowrap items-center justify-center [@media(min-width:540px)]:justify-between px-3 [@media(min-width:540px)]:px-6 py-4 text-[antiquewhite]">
        {/* Logo */}
        <div className="text-xl font-bold transition duration-300 hover:opacity-100 opacity-50 hidden [@media(min-width:540px)]:block">
          LangCoach
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Output buttons if logged in */}
          {isLoggedIn ? (
            buttonsConfig.map((el, i) => (
              <NavLink key={el.key} to={el.link || ""}>
                <Button
                  onClick={() => handleHeaderBtns(el.key, i)}
                  className={`${commonClasses} ${el.specialClasses} ${activeTab === i ? el.activeClasses : ""}`}
                  title={el.title}
                >
                  {itemInEdit !== null && i === 0 ? "Edit One" : el.name}
                </Button>
              </NavLink>
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
