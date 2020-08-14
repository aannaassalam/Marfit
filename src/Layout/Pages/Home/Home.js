import React from 'react';
import Banner from './sections/banner/Banner';
import FeatureItems from './sections/feature Items/FeatureItems';
import Slider from './sections/slider/Slider';
import Slider2 from './sections/slider2/Slider2';
import Add from './sections/add/Add';
import About from './sections/about/About';
import Testimonials from './sections/testimonials/Testimonials';
import './Home.css';

export default class Home extends React.Component{
    render(){
        return(
            <div className="main">
                <Banner/>
                <FeatureItems/>
                <Slider/>
                <Add/>
                <Slider2/>
                <About/>
                <Testimonials/>
            </div>
        )
    }
}