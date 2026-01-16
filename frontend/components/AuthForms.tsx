import { useState, useEffect } from "react";
import useMyContext from "../hooks/useMyContext";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import { useNavigate } from "react-router-dom";

function AuthForms() {
  const { isLoggedIn } = useMyContext();

  const [activeForm, setActiveForm] = useState<0 | 1>(0); // 0 - signup, 1 - login

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/view-all");
    }
  }, []);

  // ============================================================================

  return (
    <div className="max-w-md font-mono mx-auto mt-12 p-6 bg-black/50 rounded-lg shadow-md text-[antiquewhite]">
      {/* Toggle buttons */}
      <div className="flex justify-center mb-6">
        {/* Sign Up */}
        <button
          onClick={() => setActiveForm(0)}
          className={`px-4 py-2 bg-green-700 rounded-tl rounded-bl  transition duration-200 ${
            activeForm === 0 ? "opacity-100" : "opacity-50 hover:opacity-100"
          }`}
        >
          Sign Up
        </button>

        {/* Log In */}
        <button
          onClick={() => setActiveForm(1)}
          className={`px-4 py-2 bg-blue-700 rounded-tr rounded-br transition duration-200 ${
            activeForm === 1 ? "opacity-100" : "opacity-50 hover:opacity-100"
          }`}
        >
          Log In
        </button>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold text-center mb-6">{activeForm === 0 ? "Sign Up" : "Log In"}</h2>

      {/* Form */}
      {activeForm === 0 ? <SignUpForm /> : <LogInForm />}
    </div>
  );
}

export default AuthForms;
