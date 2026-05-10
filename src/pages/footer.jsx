export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <span className="divider">|</span>
          <a href="/terms">Terms of Service</a>
          <span className="divider">|</span>
          <a href="mailto:delphiadesignsllc@gmail.com">Contact</a>
        </div>

        <div className="footer-company">
          <p>© {new Date().getFullYear()} Delphia Designs LLC — All Rights Reserved</p>
          <p>Bedford Heights, Ohio, USA</p>
        </div>

        <div className="footer-cookies">
          <p>This site uses basic cookies for login and session functionality.</p>
        </div>

      </div>
    </footer>
  );
}
