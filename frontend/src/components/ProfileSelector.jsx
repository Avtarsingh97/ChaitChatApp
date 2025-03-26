import React from "react";
import boysAvatar from "./ProfileAvatar/boysAvatar.json";
import girlsAvatar from "./ProfileAvatar/girlsAvatar.json";

function ProfileSelector({ handleProfileModalClose, handleSetImage }) {
  const handleCloseBtn = () => {
    handleProfileModalClose();
  };

  const handleClickImage = (link) => {
    handleSetImage(link);
    handleProfileModalClose();
  };

  return (
    <div className='fixed w-full h-full bg-neutral-800/50 flex justify-center items-center'>
      <div className='bg-neutral-800 p-5 w-[90%] h-[90%] md:h-[75%] md:w-[60%] rounded-xl'>
        <div className='flex justify-between items-center'>
          <h1 className='text-lg sm:text-2xl font-bold text-center text-neutral-100'>Select Your Profile</h1>
          <div
            className='flex justify-center items-center text-neutral-100 cursor-pointer hover:text-red-400 text-[12px] sm:text-lg transition-colors duration-500'
            onClick={handleCloseBtn}
          >
            Close X
          </div>
        </div>

        <div className='flex flex-wrap gap-2 flex-row  mt-2 md:mt-5'>
          {boysAvatar.map((items, index) => {
            return (
              <div
                key={index}
                className='w-[15%] h-[15%] overflow-hidden p-1 rounded-full border flex justify-center items-center cursor-pointer hover:bg-black  bg-blue-400 transition-colors duration-500'
                onClick={() => handleClickImage(items.link)}
              >
                <img
                  className='rounded-full w-full'
                  src={items.link}
                  alt='avatar image'
                />
              </div>
            );
          })}

          {girlsAvatar.map((items, index) => {
            return (
              <div
                key={index}
                className='w-[15%] h-[15%] overflow-hidden p-1 rounded-full border flex justify-center items-center cursor-pointer hover:bg-black  bg-pink-400 transition-colors duration-500'
                onClick={() => handleClickImage(items.link)}
              >
                <img
                  className='rounded-full w-full'
                  src={items.link}
                  alt='avatar image'
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProfileSelector;
