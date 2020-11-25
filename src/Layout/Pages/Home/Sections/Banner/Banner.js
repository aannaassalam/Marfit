import React from "react";
import banner from "../../../../../assets/Banner.jpg";
import Loader from '../../../../Components/Loader/Loader';
import "./Banner.css";
import IndicatorDots from "./Carousel-indicators/indicator-dots";
import Carousel from "re-carousel";
import firebase from "firebase";

export default class Banner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      banner: [],
      loading: true
    }
  }

  componentDidMount() {
    firebase.firestore().collection('settings').onSnapshot(snap => {
      snap.docChanges().forEach(changes => {
        this.setState({
          banner: changes.doc.data().topBanner,
          loading: false
        })
      })
    })
  }

  render() {
    return (
      <div className="panel-container">
        {
          this.state.loading ?
            <Loader />
            :
            <div className="panel">
              <Carousel auto loop interval={5000} widgets={[IndicatorDots]}>
                {this.state.banner.map(b => {
                  return (<a href={b.link} className="cont">
                    <img src={b.url} alt="" style={{ width: "100%", height: "100%" }} />
                  </a>)
                })}
              </Carousel>
            </div>
        }
      </div>
    );
  }
}
