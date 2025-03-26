import React, { useState, useEffect } from "react";

const Coversation = (props) => {
  const [friendlist, setFriendList] = useState([]);

  useEffect(() => {
    let ownId = JSON.parse(localStorage.getItem("userInfo"))._id;
    let friendItem = props.members.filter((item) => item._id !== ownId);
    setFriendList(friendItem);
  }, []);

  const handleOnClick = () => {
    props.handleSelectedUser(props.id, friendlist);
  };

  return (
    <div
      className={`flex h-[60px] border-b-1 border-b-neutral-600 overflow-hidden items-center py-2 rounded-lg cursor-pointer hover:bg-neutral-700 hover:rounded-lg ${
        props.active ? "bg-neutral-800" : null
      }`}
      onClick={handleOnClick}
    >
      <div className='w-[55px] h-[55px] rounded-full p-1'>
        <img
          src={friendlist[0]?.profilePic}
          alt='profile image'
          className='w-full h-full rounded-full '
        />
      </div>

      <div className='grow ml-3'>
        <div className='text-lg font-bold'>{friendlist[0]?.name}</div>
        <div className='text-sm text-gray-500'>{friendlist[0]?.mobileNumber}</div>
      </div>
    </div>
  );
};

export default Coversation;
