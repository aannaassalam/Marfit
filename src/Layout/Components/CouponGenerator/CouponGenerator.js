import React from "react";

export default class couponGenerator extends React.Component {
  letterCombo() {
    var letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
    var combinations = [];
    for (var i = 0; i < 4; i++) {
      combinations.push(letters[Math.floor(Math.random() * 53)]);
      // return(letters[Math.ceil(Math.random()*52)]);
    }
    return combinations;
  }

  NumberCombo() {
    var Numbers = "01234556789";
    var combinations = [];
    for (var i = 0; i < 2; i++) {
      combinations.push(Numbers[Math.floor(Math.random() * 11)]);
      // return(letters[Math.ceil(Math.random()*52)]);
    }
    return combinations;
  }

  combo() {
    var letters = this.letterCombo();
    var numbers = this.NumberCombo();
    var combo = letters.concat(numbers);
    console.log(combo);
    combo.sort(() => Math.random() - 0.5);
    console.log(combo);
    // var coupon = ["", "", "", "", "", ""];
    // var x =0;
    // for (var i = 0; i < 40; i++) {
    //   var random = Math.ceil(Math.random() * 6);
    //   var random2 = Math.ceil(Math.random() * 6);
    //   if (coupon[random2] === "") {
    //     console.log(coupon[random2]);
    //     coupon[random2] = combo[random];
    //   } else if (coupon[random2] !== "") {
    //     console.log("jj");
    //     continue;
    //   } else {
    //     break;
    //   }
    // }
    // var couponString = "";
    // for (var j = 0; j < 6; j++) {
    //   couponString += coupon[j];
    //   console.log(coupon[j]);
    // }
    return "Hello";
  }

  render() {
    var combo = this.combo();
    console.log(combo);
    return <h1>hiii</h1>;
  }
}
