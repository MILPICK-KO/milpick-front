import { createContext, useContext, useState, useCallback } from 'react';
import { AlertModal } from '../components/AlertModal';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '안내',
    message: '',
    type: 'info',
    confirmText: '확인',
    onConfirm: null
  });

  const showAlert = useCallback((message, options = {}) => {
    setModalState({
      isOpen: true,
      title: options.title || '안내',
      message: message || '',
      type: options.type || 'info',
      confirmText: options.confirmText || '확인',
      onConfirm: options.onConfirm || null
    });
  }, []);

  const closeAlert = useCallback(() => {
    setModalState(prev => {
      if (prev.onConfirm) {
        prev.onConfirm();
      }
      return { ...prev, isOpen: false };
    });
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <AlertModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
