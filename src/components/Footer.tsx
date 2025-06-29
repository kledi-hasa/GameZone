import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, faTwitter, faInstagram, faTwitch, faYoutube, faDiscord 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faCreditCard, faHeadset, faLanguage, faStore, faTags, faUsers 
} from '@fortawesome/free-solid-svg-icons';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing, ${email}! You'll receive a 10% discount code shortly.`);
      setEmail('');
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Newsletter Section */}
      <div className={styles.newsletterBanner}>
        <div className={styles.newsletterContent}>
          <h3>Get 10% Off Your Next Purchase!</h3>
          <p>Subscribe to our newsletter for exclusive deals, gaming news, and more.</p>
          <form onSubmit={handleNewsletterSignup} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className={styles.footerGrid}>
        {/* About GameZone */}
        <div className={`${styles.footerCard} ${styles.aboutCard}`}>
          <h3 className={styles.cardTitle}><FontAwesomeIcon icon={faStore} /> GameZone</h3>
          <p>Your ultimate destination for digital games. Discover, play, and connect with a global community of gamers.</p>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialLink} aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className={styles.socialLink} aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" className={styles.socialLink} aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#" className={styles.socialLink} aria-label="Twitch"><FontAwesomeIcon icon={faTwitch} /></a>
            <a href="#" className={styles.socialLink} aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} /></a>
            <a href="#" className={styles.socialLink} aria-label="Discord"><FontAwesomeIcon icon={faDiscord} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerCard}>
          <h3 className={styles.cardTitle}><FontAwesomeIcon icon={faTags} /> Quick Links</h3>
          <ul className={styles.linkList}>
            <li><a href="#shop">Shop All Games</a></li>
            <li><a href="#collections">Featured Collections</a></li>
            <li><a href="#pre-orders">Pre-Orders</a></li>
            <li><a href="#dlcs">DLCs & Expansions</a></li>
            <li><a href="#gift-cards">Gift Cards</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className={styles.footerCard}>
          <h3 className={styles.cardTitle}><FontAwesomeIcon icon={faHeadset} /> Customer Service</h3>
          <ul className={styles.linkList}>
            <li><a href="#support">Contact Support</a></li>
            <li><a href="#faq">FAQ & Help Center</a></li>
            <li><a href="#return-policy">Return Policy</a></li>
            <li><a href="#activation-guides">Activation Guides</a></li>
          </ul>
        </div>

        {/* Community */}
        <div className={styles.footerCard}>
          <h3 className={styles.cardTitle}><FontAwesomeIcon icon={faUsers} /> Community</h3>
          <ul className={styles.linkList}>
            <li><a href="#news">Gaming News</a></li>
            <li><a href="#giveaways">Giveaways & Contests</a></li>
            <li><a href="#affiliate">Become an Affiliate</a></li>
            <li><a href="#forums">Community Forums</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.paymentMethods}>
          <span>We Accept:</span>
          <FontAwesomeIcon icon={faCreditCard} title="Credit Card" />
          {/* Add more payment icons as needed */}
        </div>
        <div className={styles.legalLinks}>
          <a href="#terms">Terms & Conditions</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#cookies">Cookie Settings</a>
        </div>
        <div className={styles.languageSelector}>
          <FontAwesomeIcon icon={faLanguage} />
          <select aria-label="Select Language">
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
          </select>
        </div>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} GameZone. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;