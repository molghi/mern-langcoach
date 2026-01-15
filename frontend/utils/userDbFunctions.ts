import axios from "axios";

// ============================================================================

async function signUp(
  email: string,
  password: string,
  passwordConfirm: string,
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    axios.defaults.withCredentials = true; // must be written before req is sent
    const response = await axios.post("http://localhost:8000/signup", { email, password, passwordConfirm });
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      setErrorMsg("");
      return response.data.email; // return either false or user email (truthy)
    } else {
      setErrorMsg(response.data.msg);
      return false;
    }
  } catch (error: unknown) {
    console.error("OOPS!", error);
    // setErrorMsg(error?.response.data.msg); // TS complains
    if (axios.isAxiosError(error)) {
      setErrorMsg(error.response?.data?.msg ?? "Request failed.");
    } else {
      setErrorMsg("Unexpected error occurred.");
    }
    return false;
  }
}

// ============================================================================

async function logIn(email: string, password: string, setErrorMsg: React.Dispatch<React.SetStateAction<string>>) {
  try {
    axios.defaults.withCredentials = true;
    const response = await axios.post("http://localhost:8000/login", { email, password });
    console.log(response);

    if (response.status === 200) {
      setErrorMsg("");
      return response.data.email; // return either false or user email (truthy)
    }
  } catch (error) {
    console.error("OOPS!", error);
    //   setErrorMsg(error.response.data.msg);
    if (axios.isAxiosError(error)) {
      setErrorMsg(error.response?.data?.msg ?? "Request failed.");
    } else {
      setErrorMsg("Unexpected error occurred.");
    }
    return false;
  }
}

// ============================================================================

// check if logged in or not -- redundant
async function checkAuth() {
  try {
    axios.defaults.withCredentials = true;
    const response = await axios.get("http://localhost:8000/check-auth");
    console.log(response);
  } catch (error) {
    console.error("OOPS!", error);
  }
}

// ============================================================================

async function logOut() {
  try {
    const response = await axios.get("http://localhost:8000/logout");
    if (response.status === 200) {
      return true; // meaning op successful
    }
    return false;
  } catch (error) {
    console.error("OOPS!", error);
    return false;
  }
}

// ============================================================================

export { signUp, logIn, checkAuth, logOut };
