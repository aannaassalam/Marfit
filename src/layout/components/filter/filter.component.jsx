import React from "react";
import "./filter.styles.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
export default class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 3,
      type: [],
      minLimit: 100,
      maxLimit: 1000,
      minPrice: 100,
      maxPrice: 1000,
    };
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
      <div className="filter-container">
        {/* <div className="top">
          <h1>TENURE MONTHS</h1>
          {this.props.month < 12 ? (
            <p>{this.props.month} months</p>
          ) : (
            <p>1 year</p>
          )}
          <div className="slider">
            <Slider
              marks={marks}
              value={this.props.month}
              step={1}
              min={3}
              max={12}
              onChange={(e) => this.handleSlider(e)}
            />
          </div>
        </div> */}
        {this.props.category.subcategories ? (
          <div className="type">
            <h1>TYPE</h1>
            {this.props.category.subcategories.map((sub) => {
              if (sub.name.toLowerCase() === this.props.subCat.toLowerCase()) {
                return sub.tags.map((tag) => {
                  return (
                    <div className="category">
                      {this.props.type.includes(tag) ? (
                        <i
                          class="fas fa-check-square"
                          onClick={() =>
                            this.props.handleProductRemoveType(tag)
                          }
                        ></i>
                      ) : (
                        <div
                          className="uncheck"
                          onClick={() => this.props.handleProductAddType(tag)}
                        ></div>
                      )}
                      <p>{tag.tag}</p>
                    </div>
                  );
                });
              }
            })}
          </div>
        ) : null}

        <div className="price">
          <h1>RENTAL RANGE</h1>
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
        {this.props.category.subcategories ? (
          <div className="cat">
            <h1>SUB-CATEGORIES</h1>
            {this.props.category.subcategories.map((sub) => {
              return (
                <a
                  href={
                    "/Category/" + this.props.category.name + "/" + sub.name
                  }
                >
                  <div className="category">
                    {sub.name.toLowerCase() ===
                    this.props.subCat.toLowerCase() ? (
                      <i class="fas fa-check-square"></i>
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
    );
  }
}
