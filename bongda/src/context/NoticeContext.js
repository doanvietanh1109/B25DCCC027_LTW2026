import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState({ text: '', id: 0 });
  const showNotice = useCallback((text) => setNotice((current) => ({ text, id: current.id + 1 })), []);
  useEffect(() => {
    if (!notice.text) return undefined;
    const timeout = setTimeout(() => setNotice((current) => ({ ...current, text: '' })), 3000);
    return () => clearTimeout(timeout);
  }, [notice.id, notice.text]);
  return <NoticeContext.Provider value={showNotice}>{notice.text && <div className="notice" role="status">{notice.text}</div>}{children}</NoticeContext.Provider>;
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) throw new Error('useNotice phải dùng bên trong NoticeProvider');
  return context;
};
