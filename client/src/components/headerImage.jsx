// HeaderImage.js
import React from 'react';
import '../styles/headerImage.styles.css';
import logo from '../assets/logo-removebg-preview.png'; // Import the logo

const HeaderImage = ({type}) => {
  return (
    <>
    {type === 'raw' ? <div className="__raw__header__image">
      <img src={logo} alt="Logo" className="__raw__logo" />
    </div> : <div className="header-image">
      <img src={logo} alt="Logo" className="logo-image" />
      <span className="logo-text">UMaT</span>
    </div>}
    </>
  );
};

export default HeaderImage;
