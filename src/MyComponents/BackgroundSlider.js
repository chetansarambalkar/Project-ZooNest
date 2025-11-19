import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "../App.css"; // Import your custom CSS file for additional styling

const BackgroundSlider = () => {
  const images = [
    { original: "img3.jpeg", thumbnail: "img12.jpg" },
    { original: "img18.jpg", thumbnail: "img18.jpg" },
    { original: "img13.jpg", thumbnail: "img13.jpg" },
    { original: "s2.jpg", thumbnail: "s2.jpg" },
    { original: "img17.jpg", thumbnail: "img16.jpg" },
  ];

  return (
    <div className="background-slider-container">
      <ImageGallery
        items={images}
        showThumbnails={false} // Hide thumbnails
        showFullscreenButton={false} // Hide fullscreen button
        showPlayButton={false} // Hide play button
        showBullets={true} // Show dots below images
        autoPlay={true} // Enable autoplay
        slideInterval={3000} // Change images every 5 seconds
        showNav={false} // Hide navigation arrows
      />
    </div>
  );
};

export default BackgroundSlider;
