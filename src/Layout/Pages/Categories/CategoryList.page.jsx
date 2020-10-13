import React from "react";
import { motion } from "framer-motion";
import "./CategoryList.style.css";

import SubCategoryList from "./Sections/Subcategory/Subcategory";
import MostRated from "./Sections/MostRated/MostRated";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import firebase from "firebase";
import empty from "./629-empty-box.json";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 0,
  },
};

const pageTransition = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

class CategoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewCategory: true,
      viewList: false,
      categories: [],
      viewListCat: "",
      productList: [],
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    firebase
      .firestore()
      .collection("settings")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          firebase
            .firestore()
            .collection("products")
            .onSnapshot((snap) => {
              var productList = [];
              snap.docChanges().forEach((change2) => {
                var product = change2.doc.data();
                if (
                  product.category.toLowerCase() ===
                  this.props.match.params.id.toLowerCase()
                ) {
                  productList.push(product);
                }
              });
              this.setState({
                categories: change.doc.data().categories,
                loading: false,
                productList: productList.sort(
                  (a, b) => b.date.toDate() - a.date.toDate()
                ),
              });
            });
        });
      });
  }

  handleViewDescShow = () => {
    this.setState({
      viewProduct: true,
    });
  };

  handleViewList = (e) => {
    this.setState({
      viewListCat: e,
      viewCategory: false,
      viewList: true,
    });
  };

  handleBackCat = () => {
    this.setState({
      viewList: false,
      viewCategory: true,
      viewProduct: false,
    });
  };

  handleBack = () => {
    this.setState({
      viewProduct: false,
    });
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              options={{ animationData: loading }}
              width={150}
              height={150}
            />
          </div>
        ) : (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="categorylist-container"
          >
            {/* Breadcrumb menu */}

            <div className="categorylist-breadcrumb">
              <div className="breadcrumb-menu">
                <div className="bd-menu-list">
                  <a href="/" style={{ cursor: "pointer" }}>
                    Home
                  </a>
                  <a>
                    <i class="fas fa-chevron-right"></i>
                  </a>
                  <a
                    href={"/Category/" + this.props.match.params.id}
                    style={{ cursor: "pointer" }}
                  >
                    {this.props.match.params.id}
                  </a>
                </div>

                <div className="bd-menu-stats">
                  <p>
                    We have total {this.state.productList.length} products under{" "}
                    <b>{this.props.match.params.id}</b> category
                  </p>
                </div>
              </div>
            </div>
            {this.state.productList.length > 0 ? (
              <>
                {/* Sub category sections */}
                <div style={{ width: "85%", maxWidth: "1500px" }}>
                  <SubCategoryList
                    parentCategory={this.props.match.params.id}
                    categories={this.state.categories}
                    handleViewList={(e) => this.handleViewList(e)}
                  />
                </div>

                {/* Most rated products for that category */}

                <MostRated
                  parentCategory={this.props.match.params.id}
                  productList={this.state.productList}
                />
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "75vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Lottie
                  options={{ animationData: empty }}
                  width={200}
                  height={200}
                />
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#313131",
                  }}
                >
                  Sorry! we could not find any items
                </p>
              </div>
            )}
          </motion.div>
        )}
      </>
    );
  }
}

export default CategoryList;
