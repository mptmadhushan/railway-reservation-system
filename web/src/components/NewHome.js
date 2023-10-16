import React, { Component } from "react";
import { routes, route, trainsByRoute, classes, schedules } from "../Services";

import { Button, Form, Col, Row, Table } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import UserHome from "./Home";
import TrainManagement from "./TrainManagement";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromOptions: [],
      toOptions: [],
      trains: [],
      errMsg: "Please fill all the fields!!!",
      showErr: false,
      isAdmin:false,
    };
  }

  componentDidMount() {
    // Check if the user item exists in localStorage
    const userString = localStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      console.log(
        "🚀 ~ file: App.js:42 ~ App ~ componentDidMount ~ user:",
        user.role
      );
      // Assuming that user authentication information is stored in 'user'
      if (user.role === "admin") {
        console.log("user -- <> -- admin");
        this.setState({ isAdmin: true });
        console.log(
          "user this.state.isAuthenticated",
          this.state.isAuthenticated
        );
      }
    }
  }
  render() {
    return <div>{this.state.isAdmin ? <TrainManagement /> : <UserHome />}</div>;
  }
}

export default Home;
