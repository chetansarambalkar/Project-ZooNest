import React, { useState } from 'react';
// Import CSS styles for the slider
import "../ImageSlider.css"; 
const ImageSlider = () => {
  const images = [
    { src: 'img16.jpg' },
    { src: 'img3.jpeg' },
    { src: 'img15.jpg'  },
    { src: 'img17.jpg'},
    { src: 'img1.jpg'},
    { src: 'img14.jpg'},
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);  // Cycle to the next image
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Cycle to the previous image
  };

  return (
    <div className="slider">
      {/* Previous Button */}
      <button className="slider-button prev" onClick={prevImage}>←</button>

      {/* Image wrapped in an anchor tag to allow clicking and navigation */}
      <a href={images[currentIndex].link}>
        <img 
          src={images[currentIndex].src} 
          alt={`Slider ${currentIndex}`} 
          className="slider-image" 
        />
      </a>
      <button type="Submit" className="view"><a href="/Gallary" className='view-gallary'>View All Animals</a></button>
      {/* Next Button */}
      <button className="slider-button next" onClick={nextImage}>→</button>
      
    </div>
  );
};

export default ImageSlider;
