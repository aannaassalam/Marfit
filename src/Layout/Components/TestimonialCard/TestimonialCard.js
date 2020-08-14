import React from 'react';
import './TestimonialCard.css';
import quote from '../../../assets/quote.png';
import marfit from '../../../assets/Marfit.png';


export default class TestimonialCard extends React.Component{

    render(){
        return(
           <div  className="testimonial-card-container">
                <div className="testimonial-card">
                <img src={quote} alt="Quote" className="quoted"/>
                <div className="testimonial-container">
                    <div className="details">
                        <img src={marfit} alt="marfit" className="profilePic"/>
                        <p>Marfit User</p>
                    </div>
                    <div className="comment">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati delectus ducimus 
                            nulla asperiores molestias voluptas quidem nemo provident, a ipsa eligendi velit 
                            saepe odit voluptates adipisci ea hic, necessitatibus 
                            aperiam neque! Delectus placeat explicabo alias eveniet ducimus sequi magni porro.
                        </p>
                    </div>
                </div>
            </div>
           </div>
        )
    }
}