import React from 'react';
import left from './assets/left.png';
import right from './assets/right.png';
import marfit from './assets/Marfit.png'
import './About.css';

export default class About extends React.Component{
    render(){
        return(
            <div className="about">
                <img src={left} alt="Left-AboutImage"/>
                <div className="white-container">
                    <img src={marfit} alt="Marfit Logo"/>
                    <p>With marfit it gets as premium as possible! Marfit aims at taking
                        mens's fashion quotient many notches up by delivering execellent 
                        handcrafted and hand-finished leather products. The shoes, bags and 
                        accessories meet international standards, which has helped us create
                        a niche value.
                    </p>
                </div>
                <img src={right} alt="Right-AboutImage" className="last"/>
            </div>
        )
    }
}