import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children, showClose = true, maxWidth = '440px' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => onClose && onClose()}>
      <div
        className="modal-container"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
      >
        {showClose && (
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X className="modal-close-icon" />
          </button>
        )}
        <div className="modal-inner-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
