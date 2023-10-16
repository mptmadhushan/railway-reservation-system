import React, { Component, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/commons/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import NewHome from "./components/NewHome";
import TrainManagement from "./components/TrainManagement";
import Contact from "./components/Contact";
import Reservations from "./components/Reservations";
import Payment from "./components/Payment";
import AccountSettings from "./components/AccountSettings";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/commons/ProtectedRoute";
class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showLogin: false,
      showRegister: false,
      isAuthenticated: true,
    };

    this.config = {
      selected: "home",
    };

    this.baseState = this.state;
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
        this.setState({ isAuthenticated: true });
        console.log("user this.state.isAuthenticated", this.state.isAuthenticated);
      }
    }
  }
  handleChange = (obj) => {
    if (obj instanceof Object) {
      this.setState({ ...obj });
    }
  };

  handleLogout = () => {
    this.setState(this.baseState);
    localStorage.clear();
  };

  handleLoginShow = () => {
    this.setState({ showLogin: true });
  };

  handleLoginClose = () => {
    this.setState({ showLogin: false });
  };

  handleRegisterShow = () => {
    this.setState({ showRegister: true });
  };

  handleRegisterClose = () => {
    this.setState({ showRegister: false });
  };

  render() {
    return (
      <>
        <div className="main-container">
          <NavBar
            handleLoginShow={this.handleLoginShow}
            handleRegisterShow={this.handleRegisterShow}
            logout={this.handleLogout}
            {...this.state}
          />

          <Login
            showLogin={this.state.showLogin}
            handleShow={this.handleLoginShow}
            handleClose={this.handleLoginClose}
            handleRegisterShow={this.handleRegisterShow}
          />

          <Register
            showRegister={this.state.showRegister}
            handleShow={this.handleRegisterShow}
            handleClose={this.handleRegisterClose}
            handleLoginShow={this.handleLoginShow}
          />

          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={NewHome} />
                <ProtectedRoute
                  path="/train"
                  component={TrainManagement}
                  isAuthenticated={!this.state.isAuthenticated}
                />
                <ProtectedRoute
                  path="/contact"
                  component={Contact}
                  isAuthenticated={this.state.isAuthenticated}
                />
                <ProtectedRoute
                  path="/reservations"
                  component={Reservations}
                  isAuthenticated={this.state.isAuthenticated}
                />
                <ProtectedRoute
                  path="/payment"
                  component={Payment}
                  isAuthenticated={this.state.isAuthenticated}
                />
                <ProtectedRoute
                  path="/account"
                  component={AccountSettings}
                  isAuthenticated={this.state.isAuthenticated}
                />
              </Switch>
            </Suspense>
          </Router>
        </div>

        <Footer />

        <ToastContainer autoClose={3000} position="bottom-right" />
      </>
    );
  }
}

export default App;
