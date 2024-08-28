import { FC } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import Dashboard from "../../components/Smart/Dashboard";
import Sidebar from "../../components/Smart/SideBar/SideBar";
import SidebarItem from "../../components/Smart/SideBar/SideBarItem";

const Home: FC = () => {
  return (
    <>
      <Sidebar>
        <SidebarItem alert={true} icon={LuLayoutDashboard} text="Home" active />
      </Sidebar>
      <section className="flex ">
        <Dashboard />
      </section>
    </>
  );
};

export default Home;
