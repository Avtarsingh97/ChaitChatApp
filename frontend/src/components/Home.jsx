import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Home({ setIsLogin }) {
  const [loginPage, setLoginPage] = useState(false);

  const funcSetLogin = (val) => {
    setLoginPage(val);
  };

  return (
    <div>
      {loginPage ? (
        <Login
        setIsLogin={setIsLogin }
          funcSetLogin={funcSetLogin}
        />
      ) : (
        <Register funcSetLogin={funcSetLogin} />
      )}
    </div>
  );
}

export default Home;
