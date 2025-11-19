import React from 'react';
import '../About.css';

export default function About() {
  return (
    <div className="about-container">
      {/* Zoo Information Section */}
      <div className="welcome-section">
        <div className="left-column">
          <h1>Welcome to ZooNest</h1>
          <p>
            Recently voted <strong>Best Zoo and India’s Top Free Attraction</strong>, ZooNest is dedicated to connecting people to animals. 
            Annually, approximately <strong>3 million visitors</strong> get the opportunity to experience <strong>1,000+ animals</strong> in the Zoo’s care.
          </p>
          <a href="https://youtu.be/aOgAQeKcPtI?si=h3Pnk29Siej9Nwp_" className="live-cam-btn">
            <span className="play-icon">▶</span> View Live Cam
          </a>
        </div>
        <div className="right-column">
          <img src="e1.jpg" alt="Zoo" className="welcome-image" />
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="mission-section">
        <div className="left-column">
          <h2 className="mission-title">Our Mission</h2>
          <ul className="mission-list">
            <li>To preserve a portion of the Colorado Desert in its natural state.</li>
            <li>To foster awareness and appreciation of the variety of plants and animals in worldwide ecosystems.</li>
            <li>To build populations of desert animals and plants threatened with extinction in the wild.</li>
            <li>To support cooperative research and educational programs protecting desert species.</li>
          </ul>
        </div>
        <div className="right-column">
          <img src="a2.jpg" alt="Mission" className="mission-image" />
        </div>
      </div>
    </div>
  );
}
