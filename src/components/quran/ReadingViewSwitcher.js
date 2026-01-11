import styles from './ReadingViewSwitcher.module.css';

export default function ReadingViewSwitcher({ activeView, onViewChange }) {
  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.switchButton} ${activeView === 'translation' ? styles.active : ''}`}
        onClick={() => onViewChange('translation')}
      >
        Translation
      </button>
      <button
        className={`${styles.switchButton} ${activeView === 'reading' ? styles.active : ''}`}
        onClick={() => onViewChange('reading')}
      >
        Reading
      </button>
    </div>
  );
}
