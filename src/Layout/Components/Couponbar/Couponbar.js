import React from 'react';
import './Couponbar.css';
import firebase from "firebase";

export default class Couponbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
    }
    componentDidMount() {
        firebase.firestore().collection('settings').get().then(snap => {
            snap.forEach(doc => {
                this.setState({
                    text: doc.data().couponBar
                })
            })
        })
    }
    render() {
        return (
            <>
                {
                    this.state.text.length > 0
                        ?
                        <div className="mini-nav">
                            <marquee width="100%" direction="left" scrollamount="3" behavior="scroll" ><p>{this.state.text}</p></marquee>
                        </div>
                        : null
                }
            </>
        )
    }
}