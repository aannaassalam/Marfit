import React from 'react';
import './Add.css';
import add from '../../../../../assets/Add.png';

export default class Add extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div onClick={() => {
                window.location.href = this.props.add.link
            }} className="add">
                <img src={this.props.add.url} alt="Advertisement" />
                {/* <a href="#" className="add-button">SHOP NOW</a> */}
            </div>
        )
    }
}