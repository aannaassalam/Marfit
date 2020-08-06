import React from 'react';
import './Add.css';
import add from './assets/Add.png';

export default class Add extends React.Component{
    render(){
        return(
            <div className="add">
                <img src={add} alt="Advertisement"/>
                {/* <a href="#" className="add-button">SHOP NOW</a> */}
            </div>
        )
    }
}