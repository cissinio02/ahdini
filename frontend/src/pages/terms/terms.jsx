import React from 'react';
import { Link } from 'react-router-dom';
import styles from './terms.module.css';

export default function Terms() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1>Terms of Service</h1>
          <p className={styles.lead}>Last updated: December 2025</p>
        </header>

        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using "Ahdini," you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. User Conduct</h2>
          <p>
            Users are expected to interact with the platform in a respectful manner. Any behavior that constitutes harassment, abuse, or disruption of service may lead to immediate suspension or termination of your account.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Privacy & Data Integrity</h2>
          <p>
            Users must respect the privacy of others. Unauthorized attempts to access personal data or investigate other users' private information are strictly prohibited.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Intellectual Property</h2>
          <p>
            All content provided on "Ahdini," including text, graphics, logos, and software, is the property of the platform and is protected by international copyright laws. Unauthorized reproduction or distribution is strictly prohibited.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Limitation of Liability</h2>
          <p>
            "Ahdini" shall not be held liable for any damages, including but not limited to loss of data or hardware damage, arising out of the use or inability to use the services provided on this website.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Privacy Policy</h2>
          <p>
            Your personal information is handled with strict confidentiality. We do not sell or share your data with third parties except as required by law or to provide the essential functions of our service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Amendments</h2>
          <p>
            We reserve the right to revise these terms at any time without prior notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.
          </p>
        </section>

        <footer className={styles.footer}>
          <p>Questions? Contact us at <a href="mailto:support@ahdini.local">support@ahdini.local</a></p>
          <p>
            <Link to="../Register">Return to Registration</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}