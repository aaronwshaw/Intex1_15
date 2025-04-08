import { useState } from 'react';
import './streamlite-styles.css'; // Import the CSS file

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: 'Information We Collect',
      content:
        'We collect personal information such as your name, email address, and viewing preferences to provide and improve our services. We may also collect device information and usage statistics.',
    },
    {
      title: 'How We Use Your Information',
      content:
        'Your information helps us personalize your experience, process payments, communicate with you about your account, and recommend content you might enjoy.',
    },
    {
      title: 'Information Sharing',
      content:
        'We do not sell your personal information. We may share information with service providers who help us operate our platform, or when required by law.',
    },
    {
      title: 'Your Choices',
      content:
        'You can update your account information, communication preferences, and privacy settings at any time through your account dashboard.',
    },
    {
      title: 'Security Measures',
      content:
        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.',
    },
  ];

  return (
    <div className="streamlite-page">
      <div className="streamlite-container">
        <h1 className="streamlite-title">Privacy Policy</h1>

        <p className="streamlite-intro">
          At StreamLite (our on-demand streaming service), we value your
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
      </div>
    </div>
  );
}
