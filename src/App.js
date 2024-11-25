import React from "react";
import { BrowserRouter } from "react-router-dom";



const App = () => {
  return (
    <div className="app d-flex">
      <BrowserRouter>
        <SideBar />
        <div className="d-flex flex-column w-100 right-layout">
          <Header />
          <Routes />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
