import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Main from './components/Main/Main'
import Profile from './components/Profile/Profile';


class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <ToastContainer
            autoClose={2000}
            hideProgressBar={true}
            position={toast.POSITION.BOTTOM_RIGHT}
          />

          <Switch>
            <Route
              exact
              path="/"
              render={props => <Login {...props} />}
            />
            <Route
              exact
              path="/main"
              render={props => <Main {...props} />}
            />
            <Route
              exact
              path="/profile"
              render={props => (<Profile {...props} />)}
            />
          </Switch>

        </div>
      </BrowserRouter>
    )
  }
}

export default App;
