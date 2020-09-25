import React from "react";
import "./Toaster.css";

export default class Toaster extends React.Component{

    static error = (props, active=true) => {
        return(
        <div className="errorContainer">
            <p>{props.text}</p>
            <i className="fas fa-times"></i>
        </div>)
    }
    static info = (props, active=true) => {
        return(
        <div className="infoContainer">
            <p>{props.text}</p>
            <i className="fas fa-times"></i>
        </div>)
    }
    static success = (props, active=true) => {
        return(
        <div className="successContainer">
            <p>{props.text}</p>
            <i className="fas fa-times"></i>
        </div>)
    }

    render(){
       return null
    }
}