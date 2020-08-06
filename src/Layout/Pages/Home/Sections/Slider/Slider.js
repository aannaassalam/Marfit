import React from 'react';
import './Slider.css';
import Card from '../../../../Components/Card/Card';
// import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
// import SwiperCore, { Navigation } from 'swiper';
import Swiper from 'swiper';

// SwiperCore.use([ Navigation ]);

export default class Slider extends React.Component{

    componentDidMount(){
        var swiper = new Swiper(".swiper-container", {
            slidesPerView: "auto",
            spaceBetween:20,
        })
    }

    render(){
        return(
            <div className="card">
                <div className="card-title">
                    <div className="card-title-mini">
                        <p>TOP TRENDING PRODUCTS</p>
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