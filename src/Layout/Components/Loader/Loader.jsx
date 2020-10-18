import React, { Component } from 'react';
import "./Loader.css";
import Lottie from "lottie-react-web";
import loader from "./lf30_editor_r1mhnlux (1).json";

export default class Loader extends Component {
    render() {
        return (
            <div className="loader">
                <Lottie options={{animationData: loader}} width={100} height={100}/>
            </div>
        )
    }
}
