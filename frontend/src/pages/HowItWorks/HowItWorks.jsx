import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import styles from './HowItWorks.module.css';
import search from '../../assets/images/search.png';
import penLine from '../../assets/images/pen-line.png';
import calendarClock from '../../assets/images/calendar-clock.png';
import neroImage from '../../assets/images/Nero2.0.jpg';
import shieldCheck from '../../assets/icons/shield-check.png';
import gem from '../../assets/icons/gem.png';
import heartHandshake from '../../assets/icons/heart-handshake.png';
import { useEffect, useRef } from 'react';

export default function HowItWorks() {
  const aboutSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (aboutSectionRef.current) {
      observer.observe(aboutSectionRef.current);
    }

    return () => {
      if (aboutSectionRef.current) {
        observer.unobserve(aboutSectionRef.current);
      }
    };
  }, []);
  return (
    <div className={styles.container}>
      <Header />
      
      <section className={styles.heroSection}>
        <h1 className={styles.mainTitle}>The Art of Thoughtful Gifting</h1>
        <p className={styles.subtitle}>
          Ahdini transforms simple gestures into unforgettable memories. Discover how easy it is to schedule surprises that matter.
        </p>
        <a
          className={styles.watchBtn}
          href="https://www.youtube.com/watch?v=fC7oUOUEEi4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.playIcon}>▶</span>
          Watch Video
        </a>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <img src={search} alt="Search" />
          </div>
          <p className={styles.stepLabel}>STEP 01</p>
          <h3 className={styles.stepTitle}>Select the Perfect Gift</h3>
          <p className={styles.stepDescription}>
            Browse our curated collection of premium gifts, from luxury floral arrangements to bespoke artisan hampers.
          </p>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <img src={penLine} alt="Pen" />
          </div>
          <p className={styles.stepLabel}>STEP 02</p>
          <h3 className={styles.stepTitle}>Personalize It</h3>
          <p className={styles.stepDescription}>
            Choose your wrapping style, add complementary treats like chocolates, and write a heartfelt digital or physical note.
          </p>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <img src={calendarClock} alt="Calendar" />
          </div>
          <p className={styles.stepLabel}>STEP 03</p>
          <h3 className={styles.stepTitle}>Schedule the Surprise</h3>
          <p className={styles.stepDescription}>
            Pick the exact date and time. We handle the rest, ensuring your gift arrives at the perfect moment to create joy.
          </p>
        </div>
      </section>

      <section className={styles.aboutSection} ref={aboutSectionRef}>
        <div className={styles.aboutContent}>
          <p className={styles.aboutLabel}>ABOUT AHDINI</p>
          <h2 className={styles.aboutTitle}>More Than Just a Delivery Service</h2>
          <p className={styles.aboutText}>
            Founded on the belief that distance shouldn't diminish affection, Ahdini was created to bridge the gap between intent and action.
          </p>
          <p className={styles.aboutText}>
            "Ahdini" — meaning "Gift me" — embodies the spirit of generosity. We aren't just a logistics company; we are architects of emotion. Every ribbon tied and every box delivered is a testament to the bond between the sender and the receiver.
          </p>
          <p className={styles.aboutText}>
            Our team of curators and delivery specialists work tirelessly to ensure that the magic of receiving a gift is preserved from the moment you click "Order" to the moment they smile.
          </p>

          <div className={styles.statsContainer}>
            <div className={styles.stat}>
              <h3 className={styles.statNumber}>50k+</h3>
              <p className={styles.statLabel}>Delivered Smiles</p>
            </div>
            <div className={styles.stat}>
              <h3 className={styles.statNumber}>100%</h3>
              <p className={styles.statLabel}>Satisfaction Rate</p>
            </div>
            <div className={styles.stat}>
              <h3 className={styles.statNumber}>24/7</h3>
              <p className={styles.statLabel}>Support Team</p>
            </div>
          </div>
        </div>
        <div className={styles.aboutImage}>
          <img src={neroImage} alt="Ahdini Team" />
        </div>
      </section>

      <section className={styles.promiseSection}>
        <h2 className={styles.promiseTitle}>Our Promise to You</h2>
        <p className={styles.promiseSubtitle}>The pillars that define the Ahdini experience.</p>
        <div className={styles.promiseCards}>
          <div className={styles.promiseCard}>
            <div className={styles.promiseIcon}>
              <img src={shieldCheck} alt="Trust & Reliability" />
            </div>
            <h3 className={styles.promiseCardTitle}>Trust & Reliability</h3>
            <p className={styles.promiseCardText}>
              We value your trust above all. Our delivery scheduling is precise, and our privacy standards are uncompromising.
            </p>
          </div>
          <div className={styles.promiseCard}>
            <div className={styles.promiseIcon}>
              <img src={gem} alt="Premium Quality" />
            </div>
            <h3 className={styles.promiseCardTitle}>Premium Quality</h3>
            <p className={styles.promiseCardText}>
              Every product is hand-picked for quality and elegance. We partner with the finest artisans and brands.
            </p>
          </div>
          <div className={styles.promiseCard}>
            <div className={styles.promiseIcon}>
              <img src={heartHandshake} alt="Emotional Intelligence" />
            </div>
            <h3 className={styles.promiseCardTitle}>Emotional Intelligence</h3>
            <p className={styles.promiseCardText}>
              We understand that a gift is a message. Our platform is designed to help you articulate your feelings perfectly.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Make Someone's Day?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of happy customers who have discovered the easiest way to send meaningful gifts.
          </p>
          <a href="/gifts" className={styles.ctaBtn}>Browse Gifts</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
