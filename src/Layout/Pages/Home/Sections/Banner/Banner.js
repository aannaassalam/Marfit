import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
// import Swiper from 'swiper';
import bags from './assets/bags.png';
import sale from './assets/sale.png';
import './Banner.css';
import SwiperCore, {Pagination, A11y, Autoplay} from 'swiper';
import 'swiper/components/pagination/pagination.scss';

SwiperCore.use([Pagination, A11y, Autoplay]);


export default class Banner extends React.Component{

    componentDidMount(){
        
    }

    render(){
        return (
            <div className="panel">
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              Autoplay={{delay: 1000}}
              pagination={{ clickable: true }}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}>

              <SwiperSlide><div className="cont"><img src={sale} alt="sale"/><img src={bags} alt="bags"/></div></SwiperSlide>
              <SwiperSlide><div className="cont"><img src={sale} alt="sale"/><img src={bags} alt="bags"/></div></SwiperSlide>
              <SwiperSlide><div className="cont"><img src={sale} alt="sale"/><img src={bags} alt="bags"/></div></SwiperSlide>
              <SwiperSlide><div className="cont"><img src={sale} alt="sale"/><img src={bags} alt="bags"/></div></SwiperSlide>
            </Swiper>
            </div>
        )
    }
}