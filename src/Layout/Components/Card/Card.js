import React from 'react';
import './Card.css';
import bagicon from './assets/bag-icon.png';

export default class Card extends React.Component{
    render(){
        return(
            <div className="card-cont">
                <img src={bagicon} alt="Bag-Icon"/>
                <div className="circle">
                    <i className="fa fa-heart"></i>
                </div>
                <div className="short-description">
                    <p className="item-title">Tan Men Sling Bag</p>
                    <p className="item-price">&#8377;999</p>
                    <div className="price-flex">
                        <p className="price-line-through">&#8377;1399</p>
                        <p className="discount">54%</p>
                    </div>
                </div>
            </div>
        )
    }
}