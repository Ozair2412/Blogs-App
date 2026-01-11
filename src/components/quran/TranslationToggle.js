import { Languages } from 'lucide-react';
import styles from './TranslationToggle.module.css';

export default function TranslationToggle({ showTranslation, onToggle }) {
  return (
    <button 
      className={`${styles.toggleButton} ${showTranslation ? styles.active : ''}`}
      onClick={onToggle}
    >
      <Languages size={18} />
      <span>{showTranslation ? 'Hide Translation' : 'Show Translation'}</span>
    </button>
  );
}
