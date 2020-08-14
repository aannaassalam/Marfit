import React from 'react';
import './MiniNav.css'

export default class MiniNav extends React.Component{
    render(){
        return(
            <div className="mini-container">
                <div className="tray">
                    <a href="/Category/Men">Men <i className="fa fa-chevron-down fa-1x"></i>
                        <div className="category-options">
                            <a href="#" className="men-bags">Bags</a>
                            <a href="#" className="belts">Belts</a>
                            <a href="#" className="wallet">Wallets</a>
                            <a href="#" className="shoes">Shoes</a>
                        </div>
                    </a>
                    <a href="./Category/Women">Women <i className="fa fa-chevron-down fa-1x"></i>
                        <div className="category-options">
                            <a href="#" className="women-bags">Hand Bags</a>
                            <a href="#" className="purse">Purse</a>
                            <a href="#" className="shoes">Shoes</a>
                        </div>
                    </a>
                    <a href="/Category/Child">Child <i className="fa fa-chevron-down fa-1x"></i>
                        <div className="category-options">
                            <a href="#" className="child-bag">School Bags</a>
                            <a href="#" className="shoes">Shoes</a>
                        </div>
                    </a>
                    <a href="/Category/Sale">Sale</a>
                </div>
            </div>
        )
    }
}