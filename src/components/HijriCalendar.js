'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import styles from './HijriCalendar.module.css';

// Islamic month names
const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

export default function HijriCalendar() {
  const [hijriDate, setHijriDate] = useState(null);
  const [gregorianDate, setGregorianDate] = useState(null);

  useEffect(() => {
    const now = new Date();

    // Get Hijri date using Intl.DateTimeFormat with Islamic calendar
    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    // Parse the Hijri date parts
    const hijriParts = hijriFormatter.formatToParts(now);
    const hijriDay = hijriParts.find(p => p.type === 'day')?.value || '';
    const hijriMonth = parseInt(hijriParts.find(p => p.type === 'month')?.value || '1', 10);
    const hijriYear = hijriParts.find(p => p.type === 'year')?.value || '';

    setHijriDate({
      day: hijriDay,
      month: HIJRI_MONTHS[hijriMonth - 1] || 'Unknown',
      year: hijriYear
    });

    // Format Gregorian date
    const dayName = now.toLocaleDateString('en-US', { weekday: 'short' });
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);

    setGregorianDate(`${dayName} ${day}-${month}-${year}`);
  }, []);

  // Don't render anything during SSR to avoid hydration mismatch
  if (!hijriDate || !gregorianDate) {
    return (
      <div className={styles.hijriCalendar}>
        <div className={styles.calendarContent}>
          <Calendar className={styles.calendarIcon} size={32} />
          <div className={styles.dateInfo}>
            <span className={styles.hijriDate}>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.hijriCalendar}>
      <div className={styles.calendarContent}>
        <Calendar className={styles.calendarIcon} size={28} />
        <div className={styles.dateInfo}>
          <span className={styles.hijriDate}>
            {hijriDate.day} {hijriDate.month}, {hijriDate.year}
          </span>
          <span className={styles.gregorianDate}>{gregorianDate}</span>
        </div>
      </div>
    </div>
  );
}
