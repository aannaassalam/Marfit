import React from "react";

import "./subcategory.style.css";

import living from "./assets/living.jpg";

class SubCategoryList extends React.Component {
  render() {
    return (
      <div className="subcategory-list-container">
        <div className="subcategory-header">
          <p>Select by {this.props.parentCategory} Category</p>
          <div className="underline"></div>
        </div>

        <div className="subcategory-grids">
          {this.props.categories.map((cat) => {
            if (
              cat.name.toLowerCase() === this.props.parentCategory.toLowerCase()
            ) {
              return (
                <>
                  {cat.subcategories.map((sub) => {
                    return (
                      <a
                        href={
                          "/Category/" +
                          this.props.parentCategory +
                          "/" +
                          sub.name
                        }
                        className="sub"
                      >
                        <img src={sub.image} alt={sub.name} />
                        <div className="room-name">
                          <p>{sub.name}</p>
                        </div>
                      </a>
                    );
                  })}
                </>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default SubCategoryList;
