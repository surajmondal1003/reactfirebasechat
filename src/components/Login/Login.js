import firebase from 'firebase'
import React, { Component } from 'react'
import Loader from 'react-loader-spinner';
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { myFirebase, myFirestore } from '../../config/firebaseConfig';
import './Login.css'

class Login extends Component {
    constructor(props) {
        super(props)
        this.provider = new firebase.auth.GoogleAuthProvider()
        this.state = {
            isLoading: true
        }
    }
    componentDidMount() {
        this.checkLogin();
    }

    checkLogin() {
        if (localStorage.getItem('id')) {
            this.setState({ isLoading: false });
            toast.success('Login success');
            this.props.history.push('/main')

        } else {
            this.setState({ isLoading: false })
        }
    }

    onLoginPress = () => {
        this.setState({ isLoading: true })
        myFirebase.auth().signInWithPopup(this.provider)
            .then(async (result) => {
                let user = result.user
                if (user) {
                    const users = await myFirestore.collection('users').where('id', '==', user.uid).get();
                    if (users.docs.length === 0) {
                        myFirestore.collection('users').doc(user.uid).set({
                            id: user.uid,
                            name: user.displayName,
                            photoUrl: user.photoURL
                        }).then(data => {
                            localStorage.setItem('id', user.uid)
                            localStorage.setItem('name', user.displayName)
                            localStorage.setItem('photoUrl', user.photoURL)
                            this.setState({ isLoading: false });
                            toast.success('Login success');
                            this.props.history.push('/main')
                        });
                    } else {
                        const [userData] = users.docs;

                        localStorage.setItem('id', userData.data().id)
                        localStorage.setItem('name', userData.data().name)
                        localStorage.setItem('photoUrl', userData.data().photoUrl)
                        this.setState({ isLoading: false });
                        toast.success('Login success');
                        this.props.history.push('/main')
                    }

                }
                else {
                    this.setState({ isLoading: false })
                    toast.warn('User Not Available');
                }
            }).catch(err => {
                this.setState({ isLoading: false })
                toast.warn(err.message);
            })

    }

    render() {
        return (
            <div className="viewRoot">
                <div className="header">React FireStore</div>
                <button className="btnLogin" type="submit" onClick={this.onLoginPress}>
                    SIGN IN WITH GOOGLE
                </button>

                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                        />
                    </div>
                ) : null}
            </div>
        )
    }
}

export default withRouter(Login);