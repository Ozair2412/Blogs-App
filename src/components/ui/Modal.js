'use client';

import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', isDanger = true }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" ref={modalRef}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`} 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`} 
            style={{ backgroundColor: isDanger ? 'var(--danger)' : 'var(--primary)' }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
