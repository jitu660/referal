import React, { createContext, useContext, useState } from "react";

interface LoadingContextType {
  hasDashboardBeenVisited: boolean;
  setDashboardVisited: () => void;
}

const defaultState: LoadingContextType = {
  hasDashboardBeenVisited: false,
  setDashboardVisited: () => {},
};

const LoadingContext = createContext<LoadingContextType>(defaultState);

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasDashboardBeenVisited, setHasDashboardBeenVisited] = useState(false);

  const setDashboardVisited = () => {
    setHasDashboardBeenVisited(true);
  };

  return (
    <LoadingContext.Provider
      value={{
        hasDashboardBeenVisited,
        setDashboardVisited,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
