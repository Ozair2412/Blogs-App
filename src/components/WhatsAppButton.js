'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton({ phoneNumber, pageTitle, pageUrl }) {
  if (!phoneNumber) return null;

  const whatsappLink = generateWhatsAppLink(phoneNumber, pageTitle, pageUrl);

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappButton}
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle size={24} />
      <span className={styles.text}>Feedback</span>
    </a>
  );
}
