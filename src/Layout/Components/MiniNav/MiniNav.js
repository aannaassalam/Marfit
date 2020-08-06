import React from 'react';
import './MiniNav.css'

export default class MiniNav extends React.Component{
    render(){
        return(
            <div className="mini-container">
                <div className="tray">
                    <a href="#">Men <i className="fa fa-caret-down fa-1x"></i></a>
                    <a href="#">Women <i className="fa fa-caret-down fa-1x"></i></a>
                    <a href="#">Child <i className="fa fa-caret-down fa-1x"></i></a>
                    <a href="#">Sale</a>
                </div>
            </div>
        )
    }
}