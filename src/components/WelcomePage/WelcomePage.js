import React, { Component } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './WelcomePage.css'

export default class WelcomeBoard extends Component {
    render() {
        return (
            <div className="viewWelcomeBoard">
                <span className="textTitleWelcome">{`Welcome, ${
                    this.props.currentUserName
                    }`}</span>
                <img
                    className="avatarWelcome"
                    src={this.props.currentUserImage}
                    alt="icon avatar"
                />
                <span className="textDesciptionWelcome">
                    Let's start talking.
        </span>
            </div>
        )
    }
}
