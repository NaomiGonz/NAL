import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <div className="bg-ivory">
      <NavBar />
      <Outlet />

    </div>
  );
};

export default App;

