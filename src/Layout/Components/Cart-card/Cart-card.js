import React from 'react';
import bag from '../../../assets/bag.png';
import './Cart-card.css';

export default class CartCard extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            counter: 1
        }
    }

    handleminus = () =>{
        var count = this.state.counter;
        if(count > 0){
            this.setState({
                counter: count-1
            })
        }
    }

    handleplus = () =>{
        var count = this.state.counter;
        this.setState({
            counter: count+1
        })
    }

    render(){
        return(
            <div className="items">
                <img src={this.props.image} alt="Bag Image"/>
                <div className="description">
                    <p className="title">{this.props.title}</p>
                    <p className="price">&#8377;{this.props.price}</p>
                    <div className="counter">
                        <span className="symbol" onClick={this.handleminus}>-</span>
                        <span>{this.state.counter}</span>
                        <span className="symbol" onClick={this.handleplus}>+</span>
                    </div>
                    <a href="#" className="remove-link">REMOVE</a>
                </div>
            </div>
        )
    }
}