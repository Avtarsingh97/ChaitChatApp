import Home from "./components/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import NotFound from './components/NotFound';

function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin")==="true");

  useEffect(() => {
    localStorage.setItem("isLogin", isLogin);
  }, [isLogin]);
  
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route
          path='/'
          element={isLogin ? <Navigate to={"/dashboard"} /> : <Home setIsLogin={setIsLogin} />}
        />
        <Route
          path='/dashboard'
          element={isLogin ? <Dashboard setIsLogin={setIsLogin} /> : <Navigate to={"/"} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
