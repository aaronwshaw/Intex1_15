import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/PricingPlans.module.css';

interface Plan {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  summary: string;
  mostPopular?: boolean;
  features: {
    devices: string;
    adFree: boolean;
    downloads: boolean;
    hd: boolean;
    ultraHD: boolean;
  };
}

interface PricingPlansProps {
  isAnnual: boolean;
  toggleBilling: () => void;
  plans: Plan[];
}

const PricingPlans: React.FC<PricingPlansProps> = ({
  isAnnual,
  toggleBilling,
  plans,
}) => {
  return (
    <section id="plans" className={`reveal ${styles.subscriptionContainer}`}>
      <h2 className="section-title">Choose Your Plan</h2>

      <div className={styles.billingTabs}>
        <button
          className={`${styles.tabButton} ${!isAnnual ? styles.activeTab : ''}`}
          onClick={() => {
            if (isAnnual) toggleBilling();
          }}
        >
          Monthly
        </button>
        <button
          className={`${styles.tabButton} ${isAnnual ? styles.activeTab : ''}`}
          onClick={() => {
            if (!isAnnual) toggleBilling();
          }}
        >
          Annual
        </button>
      </div>

      <table className={styles.planTable}>
        <thead>
          <tr>
            <th>Features</th>
            {plans.map((plan) => (
              <th
                key={plan.name}
                className={`${styles.planHeader} ${plan.mostPopular ? styles.mostPopular : ''}`}
              >
                {plan.mostPopular && (
                  <div className={styles.ribbon}>
                    <span>Most Popular</span>
                  </div>
                )}
                {plan.name}
                <br />
                <span>{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Number of Devices</td>
            {plans.map((plan) => (
              <td key={plan.name}>{plan.features.devices}</td>
            ))}
          </tr>
          <tr>
            <td>Ad-Free Streaming</td>
            {plans.map((plan) => (
              <td key={plan.name}>{plan.features.adFree ? 'Yes' : 'No'}</td>
            ))}
          </tr>
          <tr>
            <td>Offline Downloads</td>
            {plans.map((plan) => (
              <td key={plan.name}>{plan.features.downloads ? 'Yes' : 'No'}</td>
            ))}
          </tr>
          <tr>
            <td>HD Available</td>
            {plans.map((plan) => (
              <td key={plan.name}>{plan.features.hd ? 'Yes' : 'No'}</td>
            ))}
          </tr>
          <tr>
            <td>4K + HDR</td>
            {plans.map((plan) => (
              <td key={plan.name}>{plan.features.ultraHD ? 'Yes' : 'No'}</td>
            ))}
          </tr>
          <tr>
            <td></td>
            {plans.map((plan) => (
              <td key={plan.name}>
                <Link to="/login" className="btn btn-danger">
                  Select {plan.name}
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default PricingPlans;
