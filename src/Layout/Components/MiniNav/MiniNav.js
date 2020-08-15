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
          {this.state.categories.map((cat) => {
            return (
              <div className="mini-content">
                {cat.name} <i className="fa fa-chevron-down fa-1x"></i>
                <div className="category-options">
                  {cat.subcategories.map((sub) => {
                    return (
                      <a
                        href={"/Category/" + cat.name + "/" + sub.name}
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
