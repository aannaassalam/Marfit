import React from 'react';

import './sellerDesc.style.css';

class SellerDesc extends React.Component{
    render() {
        return (
            <div className ="seller-container">
                <div className = "header">
                    <p>Seller Details</p>
                    <div className = "line"></div>
                </div>
            </div>
        )
    }
}

export default SellerDesc;