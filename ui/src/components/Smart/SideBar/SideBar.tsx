import { createContext, useState } from "react";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import Logo from "../../../assets/icon/logo";
import LogoutButton from "../Buttons/LogoutButton";

export const SidebarContext = createContext({ expanded: true });

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <aside
      className="fixed left-0 z-20"
      style={{ height: "calc(100vh - 190px" }}
    >
      <nav className="h-full flex flex-col bg-white w-fit border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            <Logo color="black" width="100%" />
          </div>

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="px-3">
            <div className="flex-1">{children}</div>
            <LogoutButton />
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}
