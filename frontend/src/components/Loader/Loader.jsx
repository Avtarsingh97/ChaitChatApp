import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loader() {
  return (
    <div className="w-[100%] h-[80%] flex justify-center items-center ">
    <Box sx={{ display: "flex" }}>
      <CircularProgress sx={{color: "black", padding:"5px"}}/>
    </Box>

    </div>
  );
}

export default Loader;
