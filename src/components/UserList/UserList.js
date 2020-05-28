import React, { Component } from 'react'
import { myFirebase, myFirestore } from '../../config/firebaseConfig';
import images from '../Images/Images';
import { isTemplateElement } from '../../../node_modules/@babel/types';

class UserList extends Component {
    constructor(props) {
        super(props)

        this.currentUserId = localStorage.getItem('id')
        this.currentUserName = localStorage.getItem('name')
        this.currentUserImage = localStorage.getItem('photoUrl')


    }
    onUserItemClick(data) {

        this.props.setCurrentChatRecieverUser(data);
        // this.setState({ currentPeerUser: item.data() })
    }

    renderUsersList = () => {
        if (this.props.usersList.length > 0) {
            let viewUsersList = []
            this.props.usersList.forEach((item, index) => {
                if (item.data().id !== this.currentUserId) {
                    viewUsersList.push(
                        <button
                            key={index}
                            className={
                                this.props.currentChatRecieverUser &&
                                    this.props.currentChatRecieverUser.id === item.data().id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                this.onUserItemClick(item.data())
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={item.data().photoUrl}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">{
                                    item.data().name
                                }</span>

                            </div>
                        </button>
                    )
                }
            })
            return viewUsersList
        } else {
            return null
        }
    }

    render() {
        return (

            // <div className="viewListUser">
            <div>
                {this.renderUsersList()}
            </div>
        )
    }

}
export default UserList;




