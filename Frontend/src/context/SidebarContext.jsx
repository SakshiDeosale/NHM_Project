import React, { createContext, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isMini, setIsMini] = useState(() => {
    return localStorage.getItem('adminHMD.sidebarMini') === 'true';
  });
  const [isOpen, setIsOpen] = useState(false);

  const isDesktop = () => window.matchMedia('(min-width: 992px)').matches;

  useEffect(() => {
    if (isDesktop()) {
      if (isMini) {
        document.body.classList.add('sidebar-mini');
      } else {
        document.body.classList.remove('sidebar-mini');
      }
      document.body.classList.remove('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-mini');
      if (isOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  }, [isMini, isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isDesktop()) {
        document.body.classList.remove('sidebar-open');
        if (isMini) document.body.classList.add('sidebar-mini');
      } else {
        document.body.classList.remove('sidebar-mini');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMini]);

  const toggleSidebar = () => {
    if (isDesktop()) {
      setIsMini((prev) => {
        const next = !prev;
        localStorage.setItem('adminHMD.sidebarMini', String(next));
        return next;
      });
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    if (!isDesktop()) {
      setIsOpen(false);
    }
  };

  return (
    <SidebarContext.Provider value={{ isMini, isOpen, toggleSidebar, closeMobileSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
