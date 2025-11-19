import React from 'react'
import '../Footer.css'
export default function Footer() {
  return (

    <footer className="footer">
    <div className="footer-container">
      <div className="footer-column">
        <h3>Our Mission</h3>
        <p>About Us</p>
        <p>Where to Find Us</p>
        <p>In the News</p>
        <p>Work Here</p>
        <p>Volunteer</p>
        <p>Our Values</p>
      </div>

      <div className="footer-column">
        <h3>Animals</h3>
        <p>Gallery</p>
        <p>Contact</p>
      </div>

      <div className="footer-column">
        <h3>Contact</h3>
        <p>152,xyz street,abc city</p>
        <p>Email: <a href="mailto:sales@yoursite.com">ZooNest.com</a></p>
        <p>Phone: <a href="tel:+1234567890">(123) 456-78-90</a></p>
        
      </div>
    </div>

    <div className="footer-bottom">
      &copy; 2025 AbcThemes. All Rights Reserved.
    </div>
  </footer>  )
}


