import { useState } from "react";
import ProfileSelector from "./ProfileSelector";
import axios from "axios";
import Loader from "./Loader/Loader";
import { toast } from "react-toastify";
import Logo from '../assets/Logo.webp';

function Register({ funcSetLogin }) {
  const [loading, setLoading] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [inputField, setInputField] = useState({
    mobileNumber: "",
    name: "",
    password: "",
    profilePic: "https://www.gravatar.com/avatar/?d=mp",
  });

  const handleClickLogin = () => {
    funcSetLogin(true);
  };

  const handleSetImage = (link) => {
    setInputField({
      ...inputField,
      ["profilePic"]: link,
    });
  };

  const handleProfileModalClose = () => {
    setProfileModal((prev) => !prev);
  };

  const handleOnChange = (e, key) => {
    setInputField({
      ...inputField,
      [key]: e.target.value,
    });
  };

  const validateForm = () => {
    const { mobileNumber, name, password } = inputField;
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error("Mobile number must be 10 digits.");
      return false;
    }
    if (!name) {
      toast.error("Name is required.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, inputField)
      .then((response) => {
        toast.success("Registration successful!");
        funcSetLogin(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='md:w-full md:h-[100vh] flex bg-gradient-to-r from-neutral-800 to-neutral-800 via-neutral-500 flex-col md:flex-row items-center'>
      <div className='w-full flex flex-col justify-center items-center box-border'>
        <div className='relative mt-5'>
          <img
            src={Logo}
            alt='logo'
            className='w-[50%] m-auto'
          />
        </div>
        <div className='w-[80%] md:w-[60%] h-fit box-border mt-[5%] md:mt-5 text-neutral-100 shadow-2xl bg-neutral-800 rounded-2xl text-center  px-4 py-9'>
          <p className='text-3xl md:text-4xl font-bold'>REGISTER</p>

          <form
            method='POST'
            className='w-full box-border flex flex-col gap-2 items-center mt-8'
            onSubmit={handleRegister}
          >
            <div className='register-container flex flex-col-reverse md:flex-row gap-x-2 w-full justify-center items-center'>
              <div className='left w-full md:w-[70%] flex flex-col gap-y-2 mt-2 md:m-0'>
                <input
                  type='text'
                  value={inputField.mobileNumber}
                  onChange={(e) => handleOnChange(e, "mobileNumber")}
                  name='mobileNumber'
                  placeholder='Enter 10 Digit Mobile Number'
                  className='border border-neutral-700 rounded-lg px-5 py-2 w-full text-neutral-300 focus:outline-0'
                />
                <input
                  type='text'
                  value={inputField.name}
                  onChange={(e) => handleOnChange(e, "name")}
                  name='name'
                  placeholder='Enter name'
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
              </div>

              <div className='right w-full md:w-[30%] text-xl flex flex-row md:flex-col justify-center items-center'>
                <div className='avatar pb-2 pr-2 md:pr-0 flex justify-center'>
                  <img
                    src={inputField.profilePic}
                    alt='avatar image'
                    className='w-[100px] h-[100px] rounded-full hover:border-blue-500 border-2 cursor-pointer transition-all duration-500'
                    onClick={handleProfileModalClose}
                  />
                </div>
                <div
                  className='outline text-neutral-300 px-2 text-sm py-1 rounded-xl hover:bg-neutral-600 hover:outline-0 cursor-pointer transition-colors duration-500'
                  onClick={handleProfileModalClose}
                >
                  Select Avatar
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='bg-neutral-500 px-5 py-1 rounded-lg cursor-pointer hover:bg-blue-400 w-[50%] font-semibold text-xl mt-2 h-[45px] text-neutral-100 transition-colors duration-500'
            >
              {loading ? <Loader /> : "Register"}
            </button>
            <a
              className='cursor-pointer text-neutral-100 mt-8 hover:underline hover:text-blue-500 transition-colors duration-500'
              onClick={handleClickLogin}
            >
              Already have an account? Login
            </a>
          </form>
        </div>
      </div>
      {profileModal && (
        <div className='fixed w-full h-[100vh]'>
          <ProfileSelector
            handleSetImage={handleSetImage}
            handleProfileModalClose={handleProfileModalClose}
          />
        </div>
      )}
    </div>
  );
}

export default Register;
