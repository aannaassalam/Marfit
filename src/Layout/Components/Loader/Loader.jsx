import React, { Component } from 'react';
import "./Loader.css";
import marfit from "../../../assets/image_1.png";

export default class Loader extends Component {
    render() {
        return (
            <div className="loader">
                <img src={marfit} alt="logo"/>
            </div>
        )
    }
}
