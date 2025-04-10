import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/FloatingTrialButton.module.css';

const FloatingTrialButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register');
  };

  return (
    <button className={styles.floatingTrialButton} onClick={handleClick}>
      Start Free Trial
    </button>
  );
};

export default FloatingTrialButton;
