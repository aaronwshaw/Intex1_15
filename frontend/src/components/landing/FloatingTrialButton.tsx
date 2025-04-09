import React from 'react';
import styles from '../../styles/FloatingTrialButton.module.css';

interface FloatingTrialButtonProps {
  onClick: () => void;
}

const FloatingTrialButton: React.FC<FloatingTrialButtonProps> = ({ onClick }) => (
  <button className={styles.floatingTrialButton} onClick={onClick}>
    Start Free Trial
  </button>
);

export default FloatingTrialButton;

