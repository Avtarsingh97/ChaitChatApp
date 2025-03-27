import React, { useState, useEffect, useRef } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Conversation from "./Coversation";
import Chats from "./Chats";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import Logo from '../assets/Logo.webp';
import NoMessageImage from '../assets/NoMessageYet.webp'

function Dashboard({ setIsLogin }) {
  const [selectedUserDetails, setSelectedUserDetail] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [queryParam, setQueryParam] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  const handleSelectedUser = (id, userDetails) => {
    setSelectedUserDetail(userDetails);
    setSelectedId(id);
    socket.emit("joinConversation", id);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setSearchData([]);
      setQueryParam("");
    }
  };

  let fetchConversation = async () => {
    await axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/conversation/get-conversation`, { withCredentials: true })
      .then((response) => {
        setConversation(response.data.conversations);
      })
      .catch((err) => {
        console.log(err);
        localStorage.clear();
        setIsLogin(false);
        navigate("/");
      });
  };

  const fetchhUserBySearch = async () => {
    await axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/auth/searchedMember?queryParam=${queryParam}`, { withCredentials: true })
      .then((response) => {
        setSearchData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (queryParam.length !== 0) {
      fetchhUserBySearch();
    }
  }, [queryParam]);

  useEffect(() => {
    fetchConversation();
  }, []);

  useEffect(() => {
    if (searchData.length || searchData) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchData]);

  const handleLogout = async () => {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
      .then((response) => {
        localStorage.clear();
        setIsLogin(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateConv = async (id) => {
    await axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/conversation/add-conversation`, { receiverId: id }, { withCredentials: true })
      .then((response) => {
        // window.location.reload();

        fetchConversation();
        setSearchData([]);
        setQueryParam("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMobileNavButton = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className='w-full h-screen flex justify-center items-center bg-gradient-to-r from-neutral-800 to-neutral-800 via-neutral-500'>
      <div className=' relative w-[90%] h-[90%] bg-neutral-800 rounded-xl flex shadow-2xl '>
        {/* Left Section */}
        <div className='hidden md:block left-section w-[30%] h-full bg-neutral-900 rounded-l-xl border-r border-r-gray-800 '>
          <div className='p-4 flex flex-col h-[95%] text-white'>
            {/* Header */}
            <div className='w-full flex justify-between items-center box-border text-xl'>
              {/* logo */}
              <div>
                <img
                  src={Logo}
                  alt='logo'
                  className='w-[120px]'
                />
              </div>

              {/* Logout button */}
              <div>
                <div onClick={handleLogout}>
                  <LogoutIcon className='cursor-pointer text-gray-300' />
                </div>
              </div>
            </div>

            {/* Input Field */}
            <div className='w-full box-border my-4 flex justify-between items-center relative'>
              <input
                value={queryParam}
                onChange={(event) => {
                  setQueryParam(event.target.value);
                }}
                type='text'
                placeholder='Search'
                className='w-[85%] h-[35px] px-3 py-1 box-border rounded-3xl border border-neutral-800 bg-neutral-700 focus:outline-0'
              />
              <button
                type='submit'
                className='flex justify-center items-center p-3 border w-[35px] h-[35px] cursor-pointer rounded-full bg-neutral-800 text-white'
              >
                <SearchIcon />
              </button>

              {searchData.length ? (
                <div
                  ref={ref}
                  className='absolute top-[44px] left-[15px] z-1 w-[77%] bg-neutral-700 border-1 border-neutral-800 px-2 py-2 box-border flex flex-col gap-2 rounded-sm'
                >
                  {searchData.map((item, index) => {
                    return (
                      <div
                        key={item._id}
                        className='flex gap-2 p-1 items-center cursor-pointer hover:bg-neutral-600 rounded-sm'
                        onClick={() => handleCreateConv(item._id)}
                      >
                        <img
                          className='w-[35px] h-[35px] rounded-full'
                          src={item.profilePic}
                          alt='profile image'
                        />
                        <div>{item.name}</div>
                        <div className='text-gray-400'>{item.mobileNumber}</div>
                      </div>
                    );
                  })}
                </div>
              ) : queryParam.length !== 0 && searchData.length === 0 ? (
                <div
                  ref={ref}
                  className='absolute top-[44px] left-[15px] z-1 w-[77%] bg-neutral-700 border-1 border-neutral-800 px-2 py-2 box-border flex flex-col gap-2 rounded-sm'
                >
                  <div className='flex gap-2 p-1 items-center cursor-pointer hover:bg-neutral-600 rounded-sm'>
                    <img
                      className='w-[35px] h-[35px] rounded-full'
                      src='https://images.unsplash.com/photo-1728887823143-d92d2ebbb53a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnRvb24lMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D'
                      alt='profile image'
                    />
                    <div>No Data Found</div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Conversation Block */}
            <div className='w-full grow overflow-y-auto overflow-x-hidden'>
              {/* particular conversation block */}

              {conversation.map((item, index) => {
                return (
                  <Conversation
                    active={item._id === selectedId}
                    handleSelectedUser={handleSelectedUser}
                    item={item}
                    id={item._id}
                    members={item.members}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Mobile View Left Section */}
        <div className='block md:hidden left-section w-200px h-full bg-neutral-900 rounded-l-xl border-r border-r-gray-800 '>
          <div
            className='p-4 h-[95%] text-white'
            onClick={handleMobileNavButton}
          >
            <MenuIcon fontSize='large' />
          </div>
          {isMobileNavOpen ? (
            <div className='block absolute top-0 left-15 md:hidden left-mobile-section w-[60%] h-full bg-neutral-900 border-r border-r-gray-800 '>
              <div className='p-4 flex flex-col h-[95%] text-white'>
                {/* Header */}
                <div className='w-full flex justify-between items-center box-border text-xl'>
                  {/* logo */}
                  <div>
                    <img
                      src={Logo}
                      alt='logo'
                      className='w-[120px]'
                    />
                  </div>

                  {/* Logout button */}
                  <div>
                    <div onClick={handleLogout}>
                      <LogoutIcon className='cursor-pointer text-gray-300' />
                    </div>
                  </div>
                </div>

                {/* Input Field */}
                <div className='w-full box-border my-4 flex justify-between items-center relative'>
                  <input
                    value={queryParam}
                    onChange={(event) => {
                      setQueryParam(event.target.value);
                    }}
                    type='text'
                    placeholder='Search'
                    className='w-[85%] h-[35px] px-3 py-1 box-border rounded-3xl border border-neutral-800 bg-neutral-700 focus:outline-0'
                  />
                  <button
                    type='submit'
                    className='flex justify-center items-center p-3 border w-[35px] h-[35px] cursor-pointer rounded-full bg-neutral-800 text-white'
                  >
                    <SearchIcon />
                  </button>

                  {searchData.length ? (
                    <div
                      ref={ref}
                      className='absolute top-[44px] left-[15px] z-1 w-[77%] bg-neutral-700 border-1 border-neutral-800 px-2 py-2 box-border flex flex-col gap-2 rounded-sm'
                    >
                      {searchData.map((item, index) => {
                        return (
                          <div
                            key={item._id}
                            className='flex gap-2 p-1 items-center cursor-pointer hover:bg-neutral-600 rounded-sm'
                            onClick={() => handleCreateConv(item._id)}
                          >
                            <img
                              className='w-[35px] h-[35px] rounded-full'
                              src={item.profilePic}
                              alt='profile image'
                            />
                            <div>{item.name}</div>
                            <div className='text-gray-400'>{item.mobileNumber}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : queryParam.length !== 0 && searchData.length === 0 ? (
                    <div
                      ref={ref}
                      className='absolute top-[44px] left-[15px] z-1 w-[77%] bg-neutral-700 border-1 border-neutral-800 px-2 py-2 box-border flex flex-col gap-2 rounded-sm'
                    >
                      <div className='flex gap-2 p-1 items-center cursor-pointer hover:bg-neutral-600 rounded-sm'>
                        <img
                          className='w-[35px] h-[35px] rounded-full'
                          src='https://images.unsplash.com/photo-1728887823143-d92d2ebbb53a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnRvb24lMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D'
                          alt='profile image'
                        />
                        <div>No Data Found</div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Conversation Block */}
                <div className='w-full grow overflow-y-auto overflow-x-hidden'>
                  {/* particular conversation block */}

                  {conversation.map((item, index) => {
                    return (
                      <Conversation
                        active={item._id === selectedId}
                        handleSelectedUser={handleSelectedUser}
                        item={item}
                        id={item._id}
                        members={item.members}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Right Section */}
        {selectedUserDetails ? (
          <Chats
            selectedId={selectedId}
            selectedUserDetails={selectedUserDetails}
          />
        ) : (
          <div className='w-full md:w-[70%] flex flex-col items-center justify-center'>
            <div className='w-full md:w-[70%]'>
              <img
                src={NoMessageImage}
                alt='No Chat UI Image'
                className=' m-auto'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
