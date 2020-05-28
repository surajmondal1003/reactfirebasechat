import React, { Component } from 'react'
import Loader from 'react-loader-spinner';
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myFirestore, myStorage } from '../../config/firebaseConfig';
import images from '../Images/Images';
import { toast } from '../../../node_modules/react-toastify';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            currentUserId: localStorage.getItem('id'),
            currentUserName: localStorage.getItem('name'),
            currentUserImage: localStorage.getItem('photoUrl')
        }
        this.newAvatar = null

    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin() {
        if (!localStorage.getItem('id')) {
            this.setState({ isLoading: false });
            this.props.history.push('/')
        }
    }

    onChangeAvatar = event => {
        if (event.target.files && event.target.files[0]) {

            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') == 0) {
                this.newAvatar = event.target.files[0]
                this.setState({ currentUserImage: URL.createObjectURL(event.target.files[0]) })
            }
            else {
                toast.warn('This file is not an image')
            }

        } else {
            toast.warn('Something wrong with input file')
        }
    }

    onProfileUpdate = () => {
        this.setState({ isLoading: true })
        if (this.newAvatar) {
            console.log('entered', this.newAvatar);
            const uploadTask = myStorage.ref().child(this.state.currentUserId).put(this.newAvatar)
            uploadTask.on('state_changed', null,
                err => {
                    toast.warn(err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        console.log(downloadURL)
                        this.updateInfo(downloadURL);
                    })
                }
            )
        }
        else {
            this.updateInfo(this.state.currentUserImage);
        }

    }
    updateInfo = (downloadURL) => {
        let newInfo = {
            name: this.state.currentUserName,
            photoUrl: this.state.currentUserImage
        }

        myFirestore.collection('users').doc(this.state.currentUserId)
            .update(newInfo).then(data => {

                localStorage.setItem('name', this.state.currentUserName)
                localStorage.setItem('photoUrl', downloadURL)
                this.setState({ isLoading: false })
                this.setState({ currentUserImage: downloadURL })
                toast.success('Update info success')
                console.log(this.state);
            })

    }

    render() {
        return (
            <div className="root">
                <div className="header">
                    <span>PROFILE</span>
                </div>
                <img className="avatar" alt="Avatar" src={this.state.currentUserImage} />
                <div className="viewWrapInputFile">
                    <img
                        className="imgInputFile"
                        alt="icon gallery"
                        src={images.ic_input_file}
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        ref={el => {
                            this.refInput = el
                        }}
                        accept="image/*"
                        className="viewInputFile"
                        type="file"
                        onChange={this.onChangeAvatar}
                    />
                </div>

                <span className="textLabel">Nickname:</span>
                <input
                    className="textInput"
                    value={this.state.currentUserName ? this.state.currentUserName : ''}
                    placeholder="Your nickname..."
                    onChange={(event) => this.setState({ currentUserName: event.target.value })}
                />


                <button className="btnUpdate" onClick={this.onProfileUpdate}>
                    UPDATE
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

export default withRouter(Profile)
