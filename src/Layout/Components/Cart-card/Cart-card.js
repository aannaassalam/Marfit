import React from 'react';
import bag from './assets/bag.png';
import './Cart-card.css';

export default class CartCard extends React.Component{
    render(){
        return(
            <div className="items">
                <img src={bag} alt="Bag Image"/>
                <div className="description">
                    <p className="title">Tan Men Sling Bag</p>
                    <p className="price">&#8377;999</p>
                    <div className="counter">
                        <span>-</span>
                        <span>1</span>
                        <span>+</span>
                    </div>
                    <a href="#" className="remove-link">REMOVE</a>
                </div>
            </div>
        )
    }
}