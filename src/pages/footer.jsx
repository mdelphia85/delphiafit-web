import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="divider">|</span>
          <Link to="/terms">Terms of Service</Link>
          <span className="divider">|</span>
          <a href="mailto:delphiadesignsllc@gmail.com">Contact</a>
        </div>

        <div className="footer-company">
          <p>© {new Date().getFullYear()} Delphia Designs LLC — All Rights Reserved</p>
          <p>Bedford Heights, Ohio, USA</p>
        </div>

        <div className="footer-cookies">
          <p>This site uses browser storage for login session functionality.</p>
        </div>

      </div>
    </footer>
  );
}
