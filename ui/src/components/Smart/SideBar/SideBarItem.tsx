import { useContext } from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/constants";
import { SidebarContext } from "./SideBar";

interface SidebarItemProps {
  icon: IconType;
  text: string;
  active?: boolean;
  alert?: boolean;
}

export default function SidebarItem({
  icon: Icon,
  text,
  active,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <NavLink
      to={PAGE_ROUTES.HOME}
      className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-gradient-to-r from-[rgba(83,127,104,0.1)] to-[rgba(65,108,86,0.1)] text-[#537F69]"
              : "hover:bg-indigo-50 text-gray-600"
          }
          before:content-['']
          before:absolute before:w-1 before:h-full
          before:bg-[#537F69] before:top-0 before:left-0
      `}
    >
      <Icon size={20} />
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
    </NavLink>
  );
}
