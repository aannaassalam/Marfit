import React from "react";
import "./MiniNav.css";
import firebase from "firebase";

export default class MiniNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("settings")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          this.setState({
            categories: change.doc.data().categories,
          });
        });
      });
  }
  render() {
    return (
      <div className="mini-container">
        <div className="tray">
          {this.state.categories.map((cat, index) => {
            return (
              <div className="mini-content" key={index}>
                {cat.name} <i className="fa fa-chevron-down fa-1x"></i>
                <div className="category-options">
                  {cat.subcategories.map((sub, index) => {
                    return (
                      <a
                        href={"/Category/" + cat.name + "/" + sub.name}
                        key={index}
                      >
                        {sub.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {/* <a href="/Category/Sale">Sale</a> */}
        </div>
      </div>
    );
  }
}
