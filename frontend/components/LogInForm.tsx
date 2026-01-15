import { useState, useRef, useEffect } from "react";
import { logIn } from "../utils/userDbFunctions";
import useMyContext from "../hooks/useMyContext";

function LogInForm() {
  const { setUserEmail, setIsLoading, setIsLoggedIn, setFlashMsgContent } = useMyContext();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  // ============================================================================

  // log in action on form submit
  const attemptAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const logInSuccessful = await logIn(email, password, setErrorMsg);
    setIsLoading(false);
    if (logInSuccessful) {
      setIsLoggedIn(true);
      setFlashMsgContent(["success", "Logged in!"]);
      setUserEmail(logInSuccessful);
    }
  };

  // ============================================================================

  const formFieldsConfig: Record<any, any>[] = [
    {
      element: "input",
      required: true,
      type: "email",
      title: "email",
      name: "email",
      placeholder: "Email",
      classes:
        "px-4 py-2 bg-black/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-white transition duration-200",
    },
    {
      element: "input",
      required: true,
      type: "password",
      title: "password",
      name: "password",
      placeholder: "Password",
      classes:
        "px-4 py-2 bg-black/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-white transition duration-200",
    },
    {
      element: "button",
      type: "submit",
      classes:
        "block mt-4 px-4 py-2 bg-blue-500 text-gray-900 font-semibold rounded transition duration-200 hover:opacity-60 active:opacity-40",
    },
  ];

  // ============================================================================

  const valueGetter = (value: string) => {
    switch (value) {
      case "email":
        return email;
      case "password":
        return password;
      default:
        return "";
    }
  };

  const valueSetter = (e: any, field: string) => {
    switch (field) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        return null;
    }
  };

  // ============================================================================

  useEffect(() => {
    inputRef.current?.focus(); // focus first input
  }, []);

  // ============================================================================

  return (
    <>
      <form className="flex font-mono flex-col gap-4" onSubmit={attemptAuth}>
        {/* Iterate & create form elements */}
        {formFieldsConfig.map((x, i) => {
          let el;
          if (x.element === "input") {
            el = (
              <input
                key={i}
                ref={i === 0 ? inputRef : null}
                required={x.required}
                value={valueGetter(x.title)}
                onChange={(e) => valueSetter(e, x.title)}
                type={x.type || null}
                name={x.name || null}
                placeholder={x.placeholder || null}
                className={x.classes}
              />
            );
          }
          if (x.element === "button") {
            el = (
              <button key={i} type={x.type} className={x.classes}>
                Log In
              </button>
            );
          }
          return el;
        })}

        {/* Output Validation Errors */}
        {errorMsg && (
          <div className="mt-3 text-[red]">
            <span className="font-bold">Error:</span> {errorMsg}
          </div>
        )}
      </form>
    </>
  );
}

export default LogInForm;
