import React from 'react'
import "../App.css"
export default function Upperheader() {
  return (
    <div className="upper-header">
     <div className="brand">
        <img src="logo17.png"alt="Zoo Logo" className="navbar-logo" /><div class="national">Zoo</div><div class="zoo">Nest</div>
        <img src="addresslogo.jpg"alt="address Logo" className="address-logo" /><div class="add-name">Address</div><div class="add-loc">101,xyz,abc</div>
        <img src="contactlogo.png"alt="address Logo" className="address-logo" /><div class="contact-name">Contact</div><div class="contact-no">9246733946</div>
        <button type="Submit" class="buy-tickets"><a href="/Booking">BUY TICKETS</a></button>
    </div>
    </div>
  )
}

