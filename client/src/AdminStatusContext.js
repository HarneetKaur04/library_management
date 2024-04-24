// AdminStatus
import React, { createContext, useState, useContext } from 'react';

const AdminStatusContext = createContext();

export const AdminStatusProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const updateAdminStatus = (status) => {
    setIsAdmin(status);
  };

  return (
    <AdminStatusContext.Provider value={{ isAdmin, updateAdminStatus }}>
      {children}
    </AdminStatusContext.Provider>
  );
};

export const useAdminStatus = () => useContext(AdminStatusContext);
