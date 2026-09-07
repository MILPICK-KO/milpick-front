import { useEffect, useRef } from 'react';

export function AlertModal({ 
  isOpen, 
  title = '안내', 
  message = '', 
  type = 'info', 
  confirmText = '확인', 
  onClose 
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // 모달 오픈 시 포커스 이동 및 배경 스크롤 차단
    confirmBtnRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '🚫';
      case 'info':
      default:
        return '💡';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="custom-modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="custom-modal-dialog">
        <div className="custom-modal-header">
          <div className={`custom-modal-icon-badge ${type}`}>
            {getIcon()}
          </div>
          <h3 className="custom-modal-title">{title}</h3>
        </div>

        <div className="custom-modal-body">
          {message}
        </div>

        <div className="custom-modal-footer">
          <button
            ref={confirmBtnRef}
            type="button"
            className="custom-modal-btn"
            onClick={onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
