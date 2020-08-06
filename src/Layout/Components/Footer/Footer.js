import React from 'react';
import './Footer.css';
import marfitLogo from './assets/marfit-logo.png';
import cards from './assets/cards.png';
import email from './assets/email.png';

export default class Footer extends React.Component{
    render(){
        return(
            <div className="footer">
                <div className="flex-container">
                    <div className="container-1">
                        <div className="marfit-detail">
                            <img src={marfitLogo} alt="Marfit Logo"/>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                sed do eiusmod tempor incididunt ut labore et dolore magna
                                aliqua. Ut enim ad minim veniam, quis nostrud exercitation .
                            </p>
                        </div>
                        <div className="company-terms">

                            <div className="company-items">
                                <h3>COMPANY</h3>
                                <a href="#">Track Orders</a>
                                <a href="#">About Us</a>
                                <a href="#">Contact</a>
                            </div>

                            <div className="company-items">
                                <h3>POLICY & RULES</h3>
                                <a href="#">Returns & Refunds</a>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms & Condition</a>
                            </div>

                            <div className="company-items">
                                <h3>SUPPORT</h3>
                                <p>Chat with us</p>
                                <a href="tel:1234567890"><i className="fas fa-phone-alt"></i>+91 XXX XXX XXXX</a>
                                <a href="mailto:info@marfit.com"><i className="fas fa-envelope"></i> info@marfit.com</a>
                            </div>

                        </div>
                    </div>
                    <div className="container-2">
                        <p className="label">IT FEELS GREAT TO KNOW</p>
                        <input type="email" name="email" id="email" placeholder="Enter email address *"/>
                        <div className="icons-pack">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                        </div>
                        <p>We Accept</p>
                        <img src={cards} alt="CardsImage"/>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; Copyright 2020 . All rights reserved</p>
                </div>
            </div>
        )
    }
}