import React from "react";
import './Testimonials.css';
import Swiper from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import TestimonialCard from '../../../../components/testimonialCard/TestimonialCard';

export default class Testimonial extends React.Component{
    
    componentDidMount(){
        var swiper = new Swiper(".swiper-container", {
            slidesPerView: "auto",
            spaceBetween:20,
        })
    }

    render(){
        return(
            <div className="testimonial">
                <div className="testimonial-header">
                    <h2>TESTIMONIALS</h2>
                    <div className="lines">
                        <div className="horizontal"></div>
                        <div className="rotated-line">
                            <div className="line-through"></div>
                            <div className="line-through"></div>
                        </div>
                        <div className="horizontal"></div>
                    </div>
                </div>

                <div className="slider">
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                            <div className="swiper-slide">
                                <TestimonialCard/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}