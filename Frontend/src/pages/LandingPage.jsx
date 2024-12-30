import React from 'react';
import '../css/LandingPage.css'

export default function LandingPage() {
  return (
    <div className='LandingPage'>
      <nav>
        <div className='leftNav'>VividTalk</div>
        <div className='rightNav'>
          <p>Join as Guest</p>
          <p>Sign in</p>
          <p>Log in</p>
        </div>
      </nav>
      <div className='heroSection'>
        <div className="leftHero">
          <h2>Engage, Connect , and </h2>
          <h2> talk Vividly</h2>
          <button>Get started</button>
        </div>
        <div className="rightHero">
          <img src="/mobile.png" />
        </div>
      </div>
    </div>
  )
}
