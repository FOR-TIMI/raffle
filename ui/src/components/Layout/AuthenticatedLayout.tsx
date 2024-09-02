import { Box } from "@mui/material";
import React, { lazy } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import Sidebar from "../Smart/SideBar/SideBar";
import SidebarItem from "../Smart/SideBar/SideBarItem";

type Props = {
  children: React.ReactNode;
};

const Footer = lazy(() => import("../Common/Footer"));

const AuthenticatedLayout = ({ children }: Props) => {
  return (
    <main>
      <Box className="flex" position="relative" top={0} overflow="hidden">
        <Sidebar>
          <SidebarItem
            alert={true}
            icon={LuLayoutDashboard}
            text="Home"
            active
          />
        </Sidebar>
        <div className="flex-grow">{children}</div>
      </Box>
      <Footer />
    </main>
  );
};

export default AuthenticatedLayout;
