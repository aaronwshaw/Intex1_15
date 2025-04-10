import { useState } from 'react';
import './streamlite-styles.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState<number | null>(null);
  
  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };
  const navigate = useNavigate();
  
  const sections = [
    {
      title: "Information We Collect",
      content:
        "We collect only the personal data necessary to provide our services, including your name, email address, and viewing preferences. We also collect device information and usage data to improve service performance and user experience.",
    },
    {
      title: "Legal Basis for Processing",
      content:
        "We process your personal data based on your consent, the necessity of fulfilling a contract (e.g., providing streaming access), or our legitimate interest in improving and securing our service.",
    },
    {
      title: "How We Use Your Information",
      content:
        "Your data helps us personalize your experience, provide customer support, process transactions, and deliver content recommendations. We may also use aggregated data for analytics and performance improvements.",
    },
    {
      title: "Data Sharing and Third Parties",
      content:
        "We do not sell your personal data. We may share it with trusted service providers (e.g., payment processors, analytics platforms) who are contractually bound to protect your data. We may also disclose data when required by law.",
    },
    {
      title: "Your Rights Under GDPR",
      content:
        "You have the right to access, correct, delete, or restrict the use of your personal data. You may also object to processing and request data portability. Contact us at privacy@cineniche.com to exercise these rights.",
    },
    {
      title: "Data Retention",
      content:
        "We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws.",
    },
    {
      title: "Security Measures",
      content:
        "We implement technical and organizational measures such as encryption, access controls, and secure hosting environments to protect your data from unauthorized access or disclosure.",
    },
    {
      title: "International Data Transfers",
      content:
        "If your data is transferred outside the European Economic Area (EEA), we ensure it is protected through standard contractual clauses or other approved mechanisms.",
    },
    {
      title: "Updates to This Policy",
      content:
        "We may occasionally update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or in-app notifications.",
    },
  ];

  return (
      <div className="streamlite-page">
        <div className="streamlite-container">
          <h1 className="streamlite-title">Privacy Policy</h1>

          <p className="streamlite-intro">
            At CineNiche (our on-demand streaming service), we value your
            privacy. This Privacy Policy outlines how we collect, use, and protect
            your information.
          </p>

          <div className="streamlite-sections">
            {sections.map((section, index) => (
              <div key={index} className="streamlite-section">
                <button
                  className={`streamlite-section-button ${openSection === index ? 'streamlite-section-button-active' : ''}`}
                  onClick={() => toggleSection(index)}
                >
                  <span>{section.title}</span>
                  <span className="streamlite-indicator">
                    {openSection === index ? '−' : '+'}
                  </span>
                </button>
                {openSection === index && (
                  <div className="streamlite-section-content">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="streamlite-footer">Last updated: April 7, 2025</p>
          <p onClick={()=> navigate('/home')} style={{cursor: 'pointer',}} className="streamlite-footer streamlite-hover">Return</p>
        </div>
      </div>
  );
}

