import React from 'react';
import './Slider2.css';
import Card from '../../../../components/card/Card';
import Swiper from 'swiper';

export default class Slider2 extends React.Component{

    componentDidMount(){
        var swiper = new Swiper(".swiper-container", {
            slidesPerView: "auto",
            spaceBetween:20,
        })
    }

    render(){
        return(
            <div className="card2">
                <div className="card-title">
                    <div className="card-title-mini">
                        <p>SHOP BY BAGS</p>
                        <div className="lines">
                            <div className="horizontal"></div>
                            <div className="rotated-line">
                                <div className="line-through"></div>
                                <div className="line-through"></div>
                            </div>
                            <div className="horizontal"></div>
                        </div>
                    </div>
                    <a href="#" className="view">View All</a>
                </div>
                <div className="slider">
                <div className="swiper-container">
                        <div className="swiper-wrapper">
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                            <div className="swiper-slide">
                                <Card/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}