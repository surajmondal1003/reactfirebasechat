import React, { Component } from 'react'
import Loader from 'react-loader-spinner';
import { withRouter } from 'react-router-dom'
import { myFirebase, myFirestore } from '../../config/firebaseConfig';
import WelcomePage from '../WelcomePage/WelcomePage';
import './Main.css';
import images from '../Images/Images';
import { toast } from '../../../node_modules/react-toastify';
import UserList from '../UserList/UserList';
import ChatPage from '../ChatPage/ChatPage';
import _ from 'lodash';

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isOpenDialogConfirmLogout: false,
            currentChatRecieverUser: null
        }
        this.currentUserId = localStorage.getItem('id')
        this.currentUserName = localStorage.getItem('name')
        this.currentUserImage = localStorage.getItem('photoUrl')
        this.usersList = [];
    }
    componentDidMount() {
        this.checkLogin();
    }

    checkLogin() {
        if (localStorage.getItem('id')) {
            this.openTab(null, 'recent_chats')
            // this.getUserList()
        } else {
            this.setState({ isLoading: false });
            this.props.history.push('/')
        }
    }


    getUserList = async () => {
        this.setState({ isLoading: true });
        const users = await myFirestore.collection('users').get();
        if (users.docs.length) {
            this.usersList = [...users.docs];
            this.setState({ isLoading: false });
        }
        // const users = myFirestore.collection('users')
        //     .onSnapshot(
        //         snapshot => {
        //             snapshot.docChanges().forEach(change => {
        //                 if (change.type === 'added') {

        //                     this.usersList.push(change.doc);
        //                     this.setState({ isLoading: false });

        //                 }
        //             })
        //             this.setState({ isLoading: false })
        //         },
        //         err => {
        //             toast.warn(err.toString())
        //         }
        //     )


    }

    getRecentChats = async () => {
        this.setState({ isLoading: true });
        const users1 = await myFirestore.collection("messages")
            .where("user1_id", "==", `${this.currentUserId}`)
            .get()
        const users2 = await myFirestore.collection("messages")
            .where("user2_id", "==", `${this.currentUserId}`)
            .get()

        const [usersSnapShotList1, usersSnapShotList2] = await Promise.all([
            users1,
            users2
        ]);

        const usersList1Array = usersSnapShotList1.docs;
        const usersList2Array = usersSnapShotList2.docs;

        const usersArray = _.uniqWith(usersList1Array.concat(usersList2Array), _.isEqual);

        if (usersArray.length > 0) {
            let uersIds = usersArray.map(element => {

                if (element.data().user1_id != this.currentUserId) {
                    return element.data().user1_id
                }
                else {
                    return element.data().user2_id
                }
            })

            const recentChatusers = await myFirestore.collection('users').where('id', 'in', uersIds).get();
            if (recentChatusers.docs.length) {
                this.usersList = [...recentChatusers.docs];
            }
        }
        this.setState({ isLoading: false });
    }
    onLogoutToggleClick = () => {
        this.setState({
            isOpenDialogConfirmLogout: !this.state.isOpenDialogConfirmLogout
        })
    }

    doLogout = () => {
        this.setState({ isLoading: true })
        myFirebase.auth().signOut()
            .then(() => {
                this.setState({ isLoading: false });
                localStorage.clear()
                toast.success('Logout success')
                this.props.history.push('/')

            })
            .catch(function (err) {
                this.setState({ isLoading: false })
                toast.warn(err.message)
            })
    }


    setCurrentChatRecieverUser(data) {
        this.setState({ currentChatRecieverUser: data });

        console.log(data)
    }

    onProfileClick = () => {
        this.props.history.push('/profile')
    }

    render() {
        return (
            <div className="root">
                {/* Header */}
                <div className="header">
                    <span>LET'S CHAT</span>
                    <img
                        className="icProfile"
                        alt="An icon default avatar"
                        src={images.ic_default_avatar}
                        onClick={this.onProfileClick}
                    />
                    <img
                        className="icLogout"
                        alt="An icon logout"
                        src={images.ic_logout}
                        onClick={this.onLogoutToggleClick}
                    />
                </div>

                {/* Body */}
                <div className="body">


                    <div className="viewListUser">
                        <div className="tab">
                            <button className="tablinks" onClick={(event) => this.openTab(event, 'recent_chats')}>Recent Chats</button>
                            <button className="tablinks" onClick={(event) => this.openTab(event, 'all_chats')}>All Contacts</button>

                        </div>
                        <div id="all_chats" className="tabcontent">
                            <UserList usersList={this.usersList}
                                setCurrentChatRecieverUser={(data) => this.setCurrentChatRecieverUser(data)}
                                currentChatRecieverUser={this.state.currentChatRecieverUser}
                            />
                        </div>
                        <div id="recent_chats" className="tabcontent">
                            <UserList usersList={this.usersList}
                                setCurrentChatRecieverUser={(data) => this.setCurrentChatRecieverUser(data)}
                                currentChatRecieverUser={this.state.currentChatRecieverUser}
                            />
                        </div>

                    </div>
                    <div className="viewBoard">
                        {this.state.currentChatRecieverUser ? (
                            <ChatPage
                                currentChatRecieverUser={this.state.currentChatRecieverUser}
                            />
                        ) : (
                                <WelcomePage
                                    currentUserName={this.currentUserName}
                                    currentUserImage={this.currentUserImage}
                                />
                            )
                        }
                    </div>
                </div>

                {/* Dialog confirm */}
                {this.state.isOpenDialogConfirmLogout ? (
                    <div className="viewCoverScreen">
                        {this.renderDialogConfirmLogout()}
                    </div>
                ) : null}

                {/* Loading */}
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

    renderDialogConfirmLogout = () => {
        return (
            <div>
                <div className="viewWrapTextDialogConfirmLogout">
                    <span className="titleDialogConfirmLogout">Are you sure to logout?</span>
                </div>
                <div className="viewWrapButtonDialogConfirmLogout">
                    <button className="btnYes" onClick={this.doLogout}>
                        YES
                    </button>
                    <button className="btnNo" onClick={this.onLogoutToggleClick}>
                        CANCEL
                    </button>
                </div>
            </div>
        )
    }

    openTab(evt, tabname) {
        this.setState({ currentChatRecieverUser: null });
        if (tabname == 'recent_chats') {
            this.getRecentChats();
        } else {
            this.getUserList();
        }
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabname).style.display = "block";
        if (evt) {
            evt.currentTarget.className += " active";
        } else {
            console.log(tablinks[0].className)
            tablinks[0].className += " active";
        }
    }

}
export default withRouter(Main)