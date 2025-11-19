import React from 'react'
import "../App.css"
import '../AboutHome.css'
import ImageSlider from './ImageSlider'; 
import BackgroundSlider from "./BackgroundSlider"; 

export default function  Mainn() {
  return (
    <div>
      <div className="my-background"> 
        <BackgroundSlider />
      </div>
    
      <div className="containerr">
      <header className="title">
        Welcome To<span className="highlight"> ZooNest</span>
      </header>

      <div className="services-wrapper">
        <div className="service-column">
          <img
            src="img16.jpg"
            alt="We are Changing"
            className="service-image"
          />
          <h2 className="service-title">We are Changing</h2>
          <div className="service-description">
            We’re making some huge changes at the zoo…
          </div>
          <a  href='/About' className="service-link">
            Learn More
          </a>
        </div>

        <div className="service-column">
          <img
            src="img13.jpg"
            alt="Act for Wildlife"
            className="service-image"
          />
          <h2 className="service-title">Act for Wildlife</h2>
          <div className="service-description">
            We won’t stand back and we won’t give up.
          </div>
          <a href="/About" className="service-link">
            Learn More
          </a>
        </div>

        <div className="service-column">
          <img
            src="img15.jpg"
            alt="Support Wildlife"
            className="service-image"
          />
          <h2 className="service-title">Support Wildlife</h2>
          <div className="service-description">
            Support wildlife by visiting the ZooNest.
          </div>
          <a href="/About" className="service-link">
            Learn More
          </a>
        </div>
        <div className="service-column">
          <img
            src="img14.jpg"
            alt="Support Wildlife"
            className="service-image"
          />
          <h2 className="service-title">One Step Wildlife</h2>
          <div className="service-description">
            Connect wildlife by visiting the ZooNest.
          </div>
          <a href="/About" className="service-link">
            Learn More
          </a>
        </div>
      </div>

      <div className="more-about">
        <a href="/About" className="more-about-button">More about the zoo</a>
      </div>
    </div>
<div className='text-gallary'>
"MAIN ATTRACTION"
</div>

<div className="image-slider-container">
        <ImageSlider /> {/* Use the ImageSlider component here */}
      
      </div>
  </div>
    
  )
}


