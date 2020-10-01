import React from "react";
import "./order.css";
import firebase from "firebase";
import CartCard from "../../Components/Cart-card/Cart-card";

export default class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      order: "",
    };
  }

  componentDidMount() {
    console.log(this.props);
    firebase
      .firestore()
      .collection("orders")
      .doc(this.props.match.params.id)
      .get()
      .then((doc) => {
        this.setState({
          order: doc.data(),
        });
      });
    // firebase
    //   .firestore()
    //   .collection("products")
    //   .doc(this.props.location.id)
    //   .get()
    //   .then((doc) => {
    //     this.setState({
    //       product: [...this.state.product, doc.data()],
    //     });
    //   });
  }

  render() {
    console.log(this.state.product);
    return (
      <div className="container">
        <div className="content">
          <div className="wrap">
            <div className="main">
              <header></header>
              <main>
                <div className="Title">
                  <h2 className="title">Log in to view all order details</h2>
                  <p className="text">
                    You can find your order number in the receipt you received
                    via email.
                  </p>
                </div>
                <div className="login_form">
                  <input className="a" type="email" placeholder="Email"></input>
                  <input
                    className="b"
                    type="text"
                    placeholder="Order number"
                  ></input>
                  <button name="button" type="submit" class="btn">
                    Log in
                  </button>
                </div>

                <div className="section_content">
                  <div className="status">
                    <div className="icon">
                      <div className="confirm">
                        <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTUuNTU2IDUxNS41NTYiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTE1LjU1NiA1MTUuNTU2IiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0wIDI3NC4yMjYgMTc2LjU0OSAxNzYuODg2IDMzOS4wMDctMzM4LjY3Mi00OC42Ny00Ny45OTctMjkwLjMzNyAyOTAtMTI4LjU1My0xMjguNTUyeiIvPjwvc3ZnPg==" />
                        <span>confirmed</span>
                      </div>

                      <div className="way">
                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDEyLjAwNSA0MTIuMDA1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MTIuMDA1IDQxMi4wMDU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0wLDI4My41MjVjMCw0LjIyNCwyLjk2LDcuNTM5LDcuMTg0LDcuNTM5aDExLjQ3YzcuNzA3LTE3LDI1LjI1NC0yOS44NjQsNDUuNjI4LTI5Ljg2NA0KCQkJCWMyMC4zNzUsMCwzNy45MTgsMTIuODY0LDQ1LjYyOSwyOS44NjRIMjU5di02MUgwVjI4My41MjV6Ii8+DQoJCQk8cGF0aCBkPSJNNjQuMjgyLDI3Ny4zMmMtMTguNjczLDAtMzMuODEsMTUuMTM3LTMzLjgxLDMzLjgxYzAsMTguNjczLDE1LjEzNywzMy44MSwzMy44MSwzMy44MQ0KCQkJCWMxOC42NjQtMC4wMjEsMzMuNzg5LTE1LjE0NiwzMy44MS0zMy44MUM5OC4wOTIsMjkyLjQ1OCw4Mi45NTUsMjc3LjMyLDY0LjI4MiwyNzcuMzJ6Ii8+DQoJCQk8cGF0aCBkPSJNNDA3LjYsMjA1LjIxN2wtMzIuMi0xNC4xNTNIMjc1djEwMGgxOS40ODhjNy43MTItMTcsMjUuMjU0LTI5Ljg2NCw0NS42MjgtMjkuODY0YzIwLjM3NCwwLDM3LjkyMSwxMi44NjQsNDUuNjI4LDI5Ljg2NA0KCQkJCWgxOS4wNzJjNC4yMjQsMCw3LjE4NC0zLjMxNSw3LjE4NC03LjUzOXYtNzEuMDM0QzQxMi4xMDYsMjA5LjQwOCw0MTAuMzgsMjA2LjU1NCw0MDcuNiwyMDUuMjE3eiIvPg0KCQkJPHBhdGggZD0iTTM0Mi4yOTUsMTMzLjQwOGMtNC4wMTgtNy43MDUtMTIuMDQxLTEyLjQ4Mi0yMC43My0xMi4zNDRIMjc1djU0aDg4LjkxNUwzNDIuMjk1LDEzMy40MDh6Ii8+DQoJCQk8cGF0aCBkPSJNMjM2LjAzNiw2Ny4wNjRIMjIuODQ0QzkuOTg1LDY3LjA2NCwwLDc3LjY1LDAsOTAuNTA5djEyMy41NTVoMjU5VjkwLjUwOWMwLTAuMDM2LDAuMDAxLTAuMDcyLDAuMDAxLTAuMTA4DQoJCQkJQzI1OS4xMDQsNzcuNjE2LDI0OC44MjIsNjcuMTY3LDIzNi4wMzYsNjcuMDY0eiIvPg0KCQkJPHBhdGggZD0iTTM0MC4xMTQsMjc3LjMyYy0xOC42NzMsMC4wMDEtMzMuODEsMTUuMTM4LTMzLjgwOSwzMy44MTFjMC4wMDEsMTguNjczLDE1LjEzOCwzMy44MSwzMy44MTEsMzMuODA5DQoJCQkJYzE4LjY2NC0wLjAyMSwzMy43ODgtMTUuMTQ2LDMzLjgwOS0zMy44MWMwLDAsMC0wLjAwMSwwLTAuMDAxQzM3My45MjQsMjkyLjQ1NywzNTguNzg3LDI3Ny4zMiwzNDAuMTE0LDI3Ny4zMnoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" />
                        <span>On its way</span>
                      </div>

                      <div className="delivery">
                        <img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0ibTg2LjggNzkuMTE1YTEuNzUzIDEuNzUzIDAgMCAwIC0yLjA4LTEuMzQxbC0zLjE5NC42ODlhMS43NSAxLjc1IDAgMSAwIC43MzggMy40MjFsMy4xOTUtLjY4OWExLjc1IDEuNzUgMCAwIDAgMS4zNDEtMi4wOHoiLz48cGF0aCBkPSJtNzUuNDM2IDc5Ljc3Ni04Ljg1NSAxLjkxYTEuNzUgMS43NSAwIDEgMCAuNzM4IDMuNDIxbDguODU1LTEuOTFhMS43NSAxLjc1IDAgMCAwIC0uNzM4LTMuNDIxeiIvPjxwYXRoIGQ9Im00Ny43NDQgOTEuNzY3YTExLjAyNiAxMS4wMjYgMCAxIDAgMTMuMSA4LjQ1NCAxMS4wMzcgMTEuMDM3IDAgMCAwIC0xMy4xLTguNDU0em0zLjkxMSAxOC4xMzNhNy41MjYgNy41MjYgMCAxIDEgNS43NjktOC45NDQgNy41MzYgNy41MzYgMCAwIDEgLTUuNzY5IDguOTQ0eiIvPjxwYXRoIGQ9Im0xMjMuNCA4Ni43MjktMS40OTMtNi45MjRhMS43NSAxLjc1IDAgMCAwIC0yLjA4LTEuMzQybC02LjU5MyAxLjQyMi0xMS43OTEtNTQuNjg1YTEuNzUxIDEuNzUxIDAgMCAwIC0yLjA3OS0xLjM0MWwtMzUuMDY0IDcuNTYtMTkuNjIyIDQuMjMyLTYuNDA4LTI5LjcxM2ExLjc1MSAxLjc1MSAwIDAgMCAtMS43MTEtMS4zODFoLTMwLjI1MmExLjc0OSAxLjc0OSAwIDAgMCAtMS43NSAxLjc1djcuMDgzYTEuNzUgMS43NSAwIDAgMCAxLjc1IDEuNzVoMjMuMTIxbDE0LjU0MyA2Ny40MzZhMjAuODg3IDIwLjg4NyAwIDEgMCAyNi44IDE3LjI5M2w1MS4yODctMTEuMDYxYTEuNzUgMS43NSAwIDAgMCAxLjM0Mi0yLjA3OXptLTY4LjY4My00LjUyOS02LjIxNy0yOC44MTQgMTcuOTEyLTMuODYzIDIuNjI5IDEyLjE3N2ExLjc0NyAxLjc0NyAwIDAgMCAxLjM3NyAxLjM0OSAxLjcyMiAxLjcyMiAwIDAgMCAuMzMzLjAzMiAxLjc1MSAxLjc1MSAwIDAgMCAxLjQ1LS43N2w0LjcwNi02Ljk2IDYuNTkzIDQuNDY0YTEuNzUgMS43NSAwIDAgMCAyLjY5Mi0xLjgxNWwtMi42MjYtMTIuMTc3IDE3LjkxMi0zLjg2MyA4LjMzOSAzOC42NjMtNDMuMTI3IDkuM2EyMSAyMSAwIDAgMCAtMTEuOTczLTcuNzIzem0yMi4zNDEtNDkuOTUyIDIuNzE4IDEyLjYgMi4wNzUgOS42Mi00LjQzMi0zYTEuNzUxIDEuNzUxIDAgMCAwIC0yLjQzMS40NjlsLTMuMzg4IDUuMDE1LTQuODUxLTIyLjQ4MXptMjMuNjgyIDYuMjkxLTE3LjkxMiAzLjg2MS0yLjM0OS0xMC44OSAxNy45MTItMy44NjN6bS0zNy40MTItMy4zMyAyLjM0OSAxMC44OTEtMTcuOTEyIDMuODY1LTIuMzQ5LTEwLjg5M3ptLTMyLjQ4OC0yMy41NjloLTIyLjc4M3YtMy41ODNoMjcuMDg5bDYuNDc5IDMwLjA0MyA5LjQgNDMuNTkyYTIwLjc3NSAyMC43NzUgMCAwIDAgLTMuNjM2LjE0M2wtMTQuODM4LTY4LjgxNGExLjc1IDEuNzUgMCAwIDAgLTEuNzExLTEuMzgxem0yMi45IDEwNy45MDlhMTcuNCAxNy40IDAgMSAxIDEzLjMzMi0yMC42NzEgMTcuNDE3IDE3LjQxNyAwIDAgMSAtMTMuMzM3IDIwLjY3MXptMTYuMy0yMy4xYTIwLjczOSAyMC43MzkgMCAwIDAgLTEuMzY5LTMuMzcxbDUwLjE4OS0xMC44MjQuNzU2IDMuNXoiLz48L2c+PC9zdmc+" />

                        <span>Out for delivery</span>
                      </div>

                      <div className="recived">
                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjcuMDIgMjcuMDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI3LjAyIDI3LjAyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMDMwMTA0OyIgZD0iTTMuNjc0LDI0Ljg3NmMwLDAtMC4wMjQsMC42MDQsMC41NjYsMC42MDRjMC43MzQsMCw2LjgxMS0wLjAwOCw2LjgxMS0wLjAwOGwwLjAxLTUuNTgxDQoJCWMwLDAtMC4wOTYtMC45MiwwLjc5Ny0wLjkyaDIuODI2YzEuMDU2LDAsMC45OTEsMC45MiwwLjk5MSwwLjkybC0wLjAxMiw1LjU2M2MwLDAsNS43NjIsMCw2LjY2NywwDQoJCWMwLjc0OSwwLDAuNzE1LTAuNzUyLDAuNzE1LTAuNzUyVjE0LjQxM2wtOS4zOTYtOC4zNThsLTkuOTc1LDguMzU4QzMuNjc0LDE0LjQxMywzLjY3NCwyNC44NzYsMy42NzQsMjQuODc2eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMzAxMDQ7IiBkPSJNMCwxMy42MzVjMCwwLDAuODQ3LDEuNTYxLDIuNjk0LDBsMTEuMDM4LTkuMzM4bDEwLjM0OSw5LjI4YzIuMTM4LDEuNTQyLDIuOTM5LDAsMi45MzksMA0KCQlMMTMuNzMyLDEuNTRMMCwxMy42MzV6Ii8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzAzMDEwNDsiIHBvaW50cz0iMjMuODMsNC4yNzUgMjEuMTY4LDQuMjc1IDIxLjE3OSw3LjUwMyAyMy44Myw5Ljc1MiAJIi8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==" />
                        <span>Delivered</span>
                      </div>
                    </div>
                    <div className="icon_text">
                      <h2>Your shipment is on the way</h2>
                      <p>
                        Come back to this page for updates on your shipment
                        status.
                      </p>
                    </div>
                  </div>
                  <div className="order_update">
                    <h2>Order updates</h2>
                  </div>
                  <div className="message">
                    <p>
                      Thank You For Placing Your Order. You will Receive an SMS
                      on your registered mobile number with a link asking you to
                      confirm your CoD Order. Kindly confirm the order via the
                      same
                    </p>
                  </div>
                  <div className="customer_information">
                    <h2>Customer information</h2>
                    <div className="content_information">
                      <div className="text_area_a">
                        <h3>Shipping address</h3>
                        <p>Welcome to the website. </p>
                        <h3>Shipping method</h3>
                        <p>Welcome to the website. </p>
                      </div>
                      <div className="text_area_b">
                        <h3>Billing address</h3>
                        <p>Welcome to the website.</p>
                        <h3>Payment method</h3>
                        <p>Welcome to the website. </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="step_footer">
                  <p className="need">
                    Need help? <span>Contact us</span>
                  </p>
                  <button>Continue shopping</button>
                </div>
              </main>
              <footer></footer>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="items-container">
            {this.state.order &&
              this.state.order.products.map((item, index) => (
                <CartCard item={item} />
              ))}
          </div>
          <div className="order-details">
            <div className="shipping-sub">
              <p className="sub-title">Shipping</p>
              <p>+ &#8377; {this.state.order.shipping}</p>
            </div>
          </div>
          <div className="total">
            <p>TOTAL</p>
            <p>&#8377; {this.state.order.total}</p>
          </div>
        </div>
      </div>
    );
  }
}
