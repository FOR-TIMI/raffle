// src/components/Layout.js

import React from "react";
import NavBar from "../common/NavBar";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="p-0 h-0">
      <NavBar />
      <div className="layout-content">
        <main className=" bg-[#282828]">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
