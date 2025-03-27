import React, { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import socket from "../socket";

function Chats(props) {
  const [content, setContent] = useState("");
  const [chats, setChats] = useState([]);
  const ownId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const ref = useRef();

  const fetchMessages = async () => {
    await axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/chat/get-message-chat/${props.selectedId}`, { withCredentials: true })
      .then((response) => {
        setChats(response.data.messages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    socket.on("receiveMessage", (response) => {
      setChats([...chats, response]);
    });
  }, [chats]);

  const handleSendMessage = async () => {
    if (content.trim().length === 0) return;
    await axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/api/chat/post-message-chat`,
        {
          conversation: props.selectedId,
          content: content,
        },
        { withCredentials: true }
      )
      .then((response) => {
        socket.emit("sendMessage", props.selectedId, response.data);
        console.log(response);
        setContent("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [props.selectedId]);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behaviour: "smooth" });
  }, [chats]);

  return (
    <div className='w-full flex flex-col h-full bg-neutral-800 rounded-r-xl '>

      {/* Chat Header Section */}
      <div className='w-full h-[76px] bg-neutral-900 flex items-center px-2 py-1 box-border rounded-tr-xl'>
        <div className='flex justify-center items-center w-[50px] h-[50px] mr-2'>
          <img
            className='w-[80%] h-[80%] rounded-full'
            src={props?.selectedUserDetails[0]?.profilePic}
            alt='profile image'
          />
        </div>
        <div className='text-2xl text-neutral-200 '>{props?.selectedUserDetails[0]?.name}</div>
      </div>

      {/* Chats Block Body Section*/}
      <div className='grow h-full overflow-y-auto'>
        {chats?.map((item, index) => {
          return (
            <div
              ref={ref}
              key={index}
              className={`w-full flex gap-2 p-2 items-center box-border ${ownId === item?.sender?._id ? "flex-row-reverse" : null}`}
            >
              <div className='w-[40px] h-[40px] rounded-full'>
                <img
                  className='w-full h-full rounded-full'
                  src={item?.sender?.profilePic}
                  alt='profile image'
                />
              </div>
              <div
                className={`px-3 py-1 text-lg bg-neutral-900 text-white rounded-lg  max-w-[300px] transition-transform duration-[0.5s] cursor-pointer ${
                  ownId === item?.sender?._id ? "rounded-tr-none" : "rounded-tl-none"
                }`}
              >
                {item.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Send message Input Section */}
      <div className='h-[75px] bg-neutral-900 px-2 py-1 box-border items-center flex justify-between w-full rounded-br-xl'>
        <div className='grow '>
          <input
            type='text'
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder='Type Your Message Here.....'
            className='w-full h-[35px] px-3 py-1 box-border rounded-3xl border border-neutral-700 bg-neutral-800 focus:outline-0 text-neutral-300'
          />
        </div>
        <div onClick={handleSendMessage}>
          <SendIcon sx={{ fontSize: "32px", margin: "10px", cursor: "pointer", color: "black" }} />
        </div>
      </div>
    </div>
  );
}

export default Chats;
