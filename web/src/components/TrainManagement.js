import React, { Component } from "react";
import { routes, route, trainsByRoute, classes, schedules } from "../Services";
import { toast } from 'react-toastify'

import { Button, Form, Col, Row, Table } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import { createTrain } from "../Services";

class TrainManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromOptions: [],
      toOptions: [],
      trains: [],
      errMsg: "Please fill all the fields!!!",
      showErr: false,
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    var options = [];
    routes()
      .then((res) => {
        res.map((item, i) => {
          return item.route.map((station, i) => {
            return options.push({
              value: station.name,
              label: station.name,
              route: item._id,
              id: i,
              fair: station.fair,
            });
          });
        });
        this.setState({ fromOptions: options });
      })
      .catch((err) => {
        console.log(err);
      });
    classes()
      .then((res) => {
        var classes = [];
        res.map((trainClass, i) => {
          return classes.push({
            value: trainClass.name,
            label: trainClass.name,
            id: trainClass._id,
            fairRatio: trainClass.fairRatio,
          });
        });
        this.setState({ classes: classes });
      })
      .catch((err) => {
        console.log(err);
      });
    schedules()
      .then((res) => {
        var schedules = [];
        res.map((schedule, i) => {
          return schedules.push({
            value: schedule.time,
            label: schedule.time,
            id: schedule._id,
          });
        });
        this.setState({ schedules: schedules });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (type) => (selectedOption) => {
    this.setState({ [type]: selectedOption }, () => {
      this.calculateFair();
    });
    if (type === "from") {
      this.setState({ to: "", train: "" });
      route(selectedOption.route)
        .then((res) => {
          var options = [];
          res.route.map((station, i) => {
            return options.push({
              value: station.name,
              label: station.name,
              route: res._id,
              id: i,
              fair: station.fair,
            });
          });
          this.setState({ toOptions: options });
        })
        .catch((err) => {
          console.log(err);
        });
      trainsByRoute(selectedOption.route)
        .then((res) => {
          var options = [];
          res.map((train, i) => {
            return options.push({
              value: train.name,
              label: train.name,
              id: train._id,
            });
          });
          this.setState({ trains: options });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleQtyChange = () => (event) => {
    this.setState({ qty: event.target.value }, () => this.calculateFair());
  };

  calculateFair = () => {
    var user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
    }
    if (
      this.state.to &&
      this.state.from &&
      this.state.trainClass &&
      this.state.qty
    ) {
      var amount =
        Math.abs(this.state.to.fair - this.state.from.fair) *
        this.state.trainClass.fairRatio *
        this.state.qty;
      amount = amount.toFixed(2);
      var discount = (user && user.discount ? 0.1 * amount : 0).toFixed(2);
      var total = (amount - discount).toFixed(2);
      this.setState({ amount: amount, discount: discount, total: total });
    }
  };

  handleSubmit = (event) => {
    this.setState({ showErr: false });
    const state = this.state;
    console.log("🚀 ~ file:state:", state)
  
    const reservation = {
      name: state.qty,
      route: 'main-line',
      schedule: state.time.value,
    };
    createTrain(reservation)
      .then((res) => {
        toast.success("Successfully Added");
      })
      .catch((err) => {
        console.log(err);
      });
    event.preventDefault();
    event.stopPropagation();
  };

  handleDateChange = (dt) => {
    const date = moment(dt).format("YYYY-MM-DD");
    this.setState({ date: date });
  };

  render() {
    return (
      <Form style={{ padding: 20 }} onSubmit={(e) => this.handleSubmit(e)}>
        <Row style={{ alignItems: "center", justifyContent: "center" }}>
          <Form.Row
            style={{
              width: "75%",
              borderBottom: "1px solid rgb(200,200,200)",
              marginBottom: 20,
            }}
          >
            <h4>Add New Train</h4>
          </Form.Row>
          <Form.Row style={{ width: "75%" }}>
            <Form.Group as={Col} controlId="from">
              <Form.Label>From</Form.Label>
              <Select
                options={this.state.fromOptions}
                onChange={this.handleChange("from")}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="to">
              <Form.Label>To</Form.Label>
              <Select
                options={this.state.toOptions}
                onChange={this.handleChange("to")}
                value={this.state.to}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row style={{ width: "75%" }}>
            <Form.Group as={Col} controlId="from">
              <Form.Label>Train Name</Form.Label>

              <Form.Control
                placeholder="name"
                onChange={this.handleQtyChange()}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row style={{ width: "75%" }}>
            <Form.Group as={Col} controlId="from">
              <Form.Label>Time</Form.Label>
              <Select
                options={this.state.schedules}
                onChange={this.handleChange("time")}
                value={this.state.time}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row style={{ width: "75%" }}>
            {this.state.showErr && (
              <p style={{ color: "red" }}>{this.state.errMsg}</p>
            )}
          </Form.Row>
          <Form.Row style={{ width: "75%", padding: 5 }}>
            <Button variant="primary" type="submit">
              Add Train
            </Button>
          </Form.Row>
        </Row>
      </Form>
    );
  }
}

export default TrainManagement;
