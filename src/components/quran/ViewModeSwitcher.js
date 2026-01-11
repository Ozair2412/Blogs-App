import styles from './ViewModeSwitcher.module.css';

export default function ViewModeSwitcher({ activeView, onViewChange }) {
  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.switchButton} ${activeView === 'surah' ? styles.active : ''}`}
        onClick={() => onViewChange('surah')}
      >
        Surah
      </button>
      <button
        className={`${styles.switchButton} ${activeView === 'juz' ? styles.active : ''}`}
        onClick={() => onViewChange('juz')}
      >
        Juz
      </button>
    </div>
  );
}
