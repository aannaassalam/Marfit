import React from "react";
import "./Filter.styles.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
export default class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 3,
      type: [],
      minPrice: 0,
      maxPrice: 0,
      maxLimit: 0,
      minLimit: 0,
      loading: true
    };
  }

  componentDidMount() {
    this.setState({
      minPrice: this.props.min,
      maxPrice: this.props.max,
      minLimit: this.props.min,
      maxLimit: this.props.max,
      loading: false
    })
  }

  handleSlider = (value) => {
    this.setState({
      value,
    });
    this.props.handleMonths(value);
  };

  handleRange = (e) => {
    if (e[0] !== e[1]) {
      this.setState(
        {
          minPrice: e[0],
          maxPrice: e[1],
        },
        () => {
          console.log(e[0], e[1])
          this.props.handleRentRange(e[0], e[1]);
        }
      );
    }
  };
  render() {
    const marks = {
      3: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          {this.state.value !== 3 ? <p>3</p> : <p className="active">3</p>}
        </div>
      ),
      6: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          {this.state.value !== 6 ? <p>6</p> : <p className="active">6</p>}
        </div>
      ),
      9: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          {this.state.value !== 9 ? <p>9</p> : <p className="active">9</p>}
        </div>
      ),
      12: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          {this.state.value !== 12 ? <p>12</p> : <p className="active">12</p>}
        </div>
      ),
    };

    const price = {
      [this.state.minLimit]: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          <p>{this.state.minLimit}</p>
        </div>
      ),
      [this.state.maxLimit]: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          <p>{this.state.maxLimit}</p>
        </div>
      ),
    };
    return (
      <>
        {
          this.state.loading ?
            null :
            <div className="filter-container">
              <div className="price">
                <h1>PRICE RANGE</h1>
                <p>
                  &#8377;{this.state.minPrice} - &#8377;{this.state.maxPrice}
                </p>
                <div className="slider">
                  <Range
                    marks={price}
                    allowCross={false}
                    value={[this.props.min, this.props.max]}
                    step={50}
                    min={this.state.minLimit}
                    max={this.state.maxLimit}
                    onChange={(e) => this.handleRange(e)}
                  />
                </div>
              </div>

              <div className="avail">
                <h1>AVAILABILITY</h1>
                <div className="category">
                  {this.props.outStock ? (
                    <i
                      class="fas fa-check-square"
                      onClick={this.props.handleProductInStock}
                    ></i>
                  ) : (
                      <div
                        className="uncheck"
                        onClick={this.props.handleProductOutStock}
                      ></div>
                    )}
                  <p>Out of Stock</p>
                </div>
              </div>

              {this.props.colors.length > 0 ? (
                <div className="colors">
                  <h1>Colors</h1>
                  {this.props.colors.map((color, index) => {
                    console.log(this.props.presentColor)
                    return (
                      <div
                        key={index}
                        onClick={() => this.props.handleColorFilter(color)}
                      >
                        <div className="colorCheck">
                          {color.toLowerCase() ===
                            this.props.presentColor.toLowerCase() ? (
                              <i className="fas fa-check-square"></i>
                            ) : (
                              <div className="uncheck"></div>
                            )}
                          <p>{color}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {this.props.category.subcategories ? (
                <div className="cat">
                  <h1>SUB-CATEGORIES</h1>
                  {this.props.category.subcategories.map((sub, index) => {
                    return (
                      <a
                        key={index}
                        href={
                          "/Category/" + this.props.category.name + "/" + sub.name
                        }
                      >
                        <div className="category">
                          {sub.name.toLowerCase() ===
                            this.props.subCat.toLowerCase() ? (
                              <i className="fas fa-check-square"></i>
                            ) : (
                              <div className="uncheck"></div>
                            )}
                          <p>{sub.name}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
        }
      </>
    );
  }
}
