import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export default function ModalContextProvider({ children }) {
  const [modalOptions, setModalOptions] = useState({});
  return <ModalContext.Provider value={[modalOptions, setModalOptions]}>{children}</ModalContext.Provider>;
}
