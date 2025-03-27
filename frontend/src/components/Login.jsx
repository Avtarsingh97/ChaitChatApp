import { useState } from "react";
import axios from "axios";
import Loader from "./Loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from '../assets/Logo.webp';

function Login({ funcSetLogin, setIsLogin }) {
  const [inputField, setInputField] = useState({ mobileNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickNotRegistered = () => {
    funcSetLogin(false);
  };

  const handleOnChange = (e, key) => {
    setInputField({
      ...inputField,
      [key]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/login`, 
      inputField, 
      { withCredentials: true }
    );
      console.log(repsonse);

    if (!response.data || !response.data.user) {
      throw new Error("Invalid API response. No user data received.");
    }

    const userInfo = response.data.user;
    console.log("User Info:", userInfo); // Debugging User Info

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("isLogin", "true");
    setIsLogin(true);
    navigate("/dashboard");

  } catch (err) {
    console.error("Login Error:", err);
    let errorMsg = err.response?.data?.error || "Login failed. Please try again.";
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className='md:w-full h-[100vh] flex bg-gradient-to-r from-neutral-800 to-neutral-800 via-neutral-500 flex-col md:flex-row items-center'>
      <div className='w-full flex flex-col justify-center items-center box-border'>
        <div className='relative mt-5'>
          <img
            src={Logo}
            alt='logo'
            className='w-[50%] m-auto'
          />
        </div>

        <div className='w-[80%] md:w-[40%] h-fit box-border mt-[5%] md:mt-5 text-neutral-100 shadow-2xl bg-neutral-800 rounded-2xl text-center  px-4 py-9'>
          <p className='text-3xl md:text-4xl font-bold '>LOGIN</p>
          <form
            className='w-full box-border flex flex-col gap-2 items-center mt-8'
            method='POST'
          >
            <input
              type='text'
              value={inputField.mobileNumber}
              onChange={(e) => handleOnChange(e, "mobileNumber")}
              name='mobileNumber'
              placeholder='Enter Mobile Number'
              className='border border-neutral-700 rounded-lg px-5 py-2 w-full text-neutral-300 focus:outline-0'
            />
            <input
              type='password'
              value={inputField.password}
              onChange={(e) => handleOnChange(e, "password")}
              name='password'
              placeholder='Enter Password'
              className='border border-neutral-700 rounded-lg px-5 py-2 w-full text-neutral-300 focus:outline-0'
            />
            <button
              className='bg-neutral-500 px-5 py-1 rounded-lg cursor-pointer hover:bg-blue-400 w-[50%] font-semibold text-xl mt-2 h-[45px] text-neutral-100 transition-colors duration-500'
              onClick={(e) => handleLogin(e)}
            >
              {loading ? <Loader /> : "Login"}
            </button>
            <a
              className='cursor-pointer text-neutral-100 mt-8 hover:underline hover:text-blue-500 transition-colors duration-500'
              onClick={handleClickNotRegistered}
            >
              Not Registered Yet
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
