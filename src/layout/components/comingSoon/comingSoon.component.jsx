import React from 'react';

import './comingSoon.style.css';
import coming from './12366-under-construction.json';
import Lottie from "lottie-react-web";

class ComingSoon extends React.Component{
    render() {
        return(
            <div className="coming-soon-container">
                <div className = "coming-box">
                    <Lottie
                        options={{ animationData: coming }}
                        width={350}
                        height={350}
                    />
                    <h1>We Are Coming Soon !</h1>
                </div>
            </div>
        )
    }
}

export default ComingSoon;