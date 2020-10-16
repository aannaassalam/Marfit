import React, { Component } from 'react'
import Lottie from "lottie-react-web";
import loader from "";

export default class Loader extends Component {
    render() {
        return (
            <div className="loader">
                <Lottie options={{animationData: loader}} width={100} height={100}/>
            </div>
        )
    }
}
