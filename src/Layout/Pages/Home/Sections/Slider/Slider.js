import React from 'react';
import './Slider.css';
import Card from '../../../../components/card/Card';
import Swiper from 'swiper';

export default class Slider extends React.Component{

    componentDidMount(){
        var swiper = new Swiper(".swiper-container", {
            slidesPerView: "auto",
            spaceBetween:20,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
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
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-button-next"></div>
                    </div>
                </div>
            </div>
        )
    }
}