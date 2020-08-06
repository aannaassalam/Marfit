import React from 'react';
import './Navbar.css';
import logo from './assets/image_1.png';
import title from './assets/marfit-label.png';

export default class Navbar extends React.Component{

    handleClick = () => {
        document.getElementsByClassName('hamburger-menu')[0].style.display = 'block';
    }

    handleReverseClick = () => {
        document.getElementsByClassName('hamburger-menu')[0].style.display = 'none';
    }

    handleShop = () => {
        document.getElementsByClassName('shop-menu')[0].style.display = 'flex';
        // document.getElementById('caret').style.rotate = '90deg';
    }

    render(){
        return(
            <nav className="navbar">
                <div className="nav-container">
                    <div className="first-container">
                        <i className="fa fa-bars fa-2x" onClick={this.handleClick} aria-hidden="true"></i>
                        <div className="logo">
                            <img src={logo} alt="Marfit Logo" className="logo-img"/>
                            <img src={title} alt="Marfit Title" className="logo-title"/>
                        </div>
                    </div>
                    <div className="second-container">
                        <i className="fa fa-search"></i>
                        <input type="text" name="search" id="search" placeholder='What are you looking for ?'/>
                    </div>
                    <div className="third-container">
                        <a href="#" className="search-icon"><i className="fa fa-search"></i></a>
                        <a href="#" className="links"><i className="fa fa-heart"></i><p>WISHLIST</p></a>
                        <a href="#" className="links"><i className="fas fa-shopping-cart"></i><p>CART</p></a>
                        <a href="#" className="links"><i className="fas fa-user"></i><p>LOGIN</p></a>
                    </div>
                </div>
                <div className="hamburger-menu">
                    <div className="head">
                        <div className="logo">
                            <img src={logo} alt="Marfit Logo" className="logo-img"/>
                            <img src={title} alt="Marfit Title" className="logo-title"/>
                        </div>
                        <i className="fa fa-times fa-1x" onClick={this.handleReverseClick} ></i>
                    </div>
                    <div className="line"></div>
                    <div className="ham-list">
                        <div className="box"><a href="#">Home</a><i className="fa fa-caret-right fa-1x"></i></div>
                        <div className="box"><a href="#">Contact us</a><i className="fa fa-caret-right fa-1x"></i></div>
                        <div className="box" id="shop" onClick={this.handleShop} ><a href="#">Shop</a><i className="fa fa-caret-right fa-1x" id='caret'></i></div>
                        <div className="shop-menu box">
                            <a href="#" className="men">Mens</a>
                            <a href="#" className="men">Womens</a>
                            <a href="#" className="men">Child</a>
                            <a href="#" className="men">Sale</a>
                        </div>
                        <div className="box"><a href="#">Wishlist</a><i className="fa fa-caret-right fa-1x"></i></div>
                        <div className="box orange"><a href="#">Login</a><i className="fa fa-caret-right fa-1x"></i></div>
                    </div>
                </div>
            </nav>
        )
    }
}