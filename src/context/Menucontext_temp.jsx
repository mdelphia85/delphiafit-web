import { createContext, useState } from "react";

export const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // NEW: tells Progress.jsx to reload after saving a log
  const [refreshProgress, setRefreshProgress] = useState(false);

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <MenuContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        openMenu,
        closeMenu,
        refreshProgress,
        setRefreshProgress
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
