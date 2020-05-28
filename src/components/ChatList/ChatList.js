import moment from 'moment'
import React, { Component } from 'react'

import { myFirestore, myStorage } from '../../config/firebaseConfig';
import images from '../Images/Images';



class ChatList extends Component {
    constructor(props) {
        super(props)
        this.currentUserId = localStorage.getItem('id')
        this.currentUserImage = localStorage.getItem('photoUrl')
        this.currentChatRecieverUser = this.props.currentChatRecieverUser
        this.messagesList = this.props.messagesList
        this.types = {
            text: 'text',
            photo: 'photo',
            sticker: 'sticker',
        }
    }

    renderListMessage = () => {
        if (this.messagesList.length > 0) {
            let viewListMessage = []
            this.messagesList.forEach((item, index) => {
                if (item.idFrom === this.currentUserId) {
                    // Item right (my message)
                    if (item.type === this.types.text) {
                        viewListMessage.push(
                            <div className="shiftRight" key={item.timestamp}>
                                <img
                                    src={this.currentUserImage}
                                    alt="avatar"
                                    className="peerAvatarLeft"
                                />
                                <div className="viewItemRight" >
                                    <span className="textContentItem">{item.content}</span>
                                </div>
                                <span className="textTimeLeft">
                                    {moment(Number(item.timestamp)).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                                </span>

                            </div>
                        )
                    }
                    else if (item.type === this.types.photo) {
                        viewListMessage.push(
                            <div className="shiftRight" key={item.timestamp}>
                                <img
                                    src={this.currentUserImage}
                                    alt="avatar"
                                    className="peerAvatarLeft"
                                />
                                <div className="viewItemRight2">
                                    <img
                                        className="imgItemRight"
                                        src={item.content}
                                        alt="content message"
                                    />
                                </div>
                                <span className="textTimeLeft">
                                    {moment(Number(item.timestamp)).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                                </span>

                            </div>
                        )
                    }
                    else if (item.type === this.types.sticker) {
                        viewListMessage.push(
                            <div className="shiftRight" key={item.timestamp}>
                                <img
                                    src={this.currentUserImage}
                                    alt="avatar"
                                    className="peerAvatarLeft"
                                />
                                <div className="viewItemRight3">
                                    <img
                                        className="imgItemRight"
                                        src={item.content}
                                        alt="content message"
                                    />
                                </div>
                                <span className="textTimeLeft">
                                    {moment(Number(item.timestamp)).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                                </span>

                            </div>
                        )
                    }
                } else {
                    // Item left (peer message)
                    if (item.type === this.types.text) {
                        viewListMessage.push(
                            <div className="shiftLeft" key={item.timestamp}>

                                <div className="viewWrapItemLeft">
                                    <div className="viewWrapItemLeft3">
                                        <img
                                            src={this.currentChatRecieverUser.photoUrl}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                        <div className="viewItemLeft">
                                            <span className="textContentItem">{item.content}</span>
                                        </div>
                                    </div>
                                    <span className="textTimeLeftRight">
                                        {moment(Number(item.timestamp)).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                                    </span>
                                </div>
                            </div>
                        )
                    }

                    else if (item.type === this.types.photo) {
                        viewListMessage.push(
                            <div className="shiftLeft" key={item.timestamp}>

                                <div className="viewWrapItemLeft2">
                                    <div className="viewWrapItemLeft3">
                                        <img
                                            src={this.currentChatRecieverUser.photoUrl}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                        <div className="viewItemLeft2">
                                            <img
                                                className="imgItemLeft"
                                                src={item.content}
                                                alt="content message"
                                            />
                                        </div>
                                    </div>
                                    <span className="textTimeLeftRight">
                                        {moment(Number(item.timestamp)).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                                    </span>
                                </div>
                            </div>
                        )
                    }

                    else if (item.type === this.types.sticker) {
                        viewListMessage.push(
                            <div className="shiftLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft2">
                                    <div className="viewWrapItemLeft3">
                                        <img
                                            src={this.currentChatRecieverUser.photoUrl}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                        <div className="viewItemLeft3" key={item.timestamp}>
                                            <img
                                                className="imgItemLeft"
                                                src={item.content}
                                                alt="content message"
                                            />
                                        </div>
                                    </div>
                                    <span className="textTimeLeftRight">
                                        {moment(Number(item.timestamp)).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                                    </span>
                                </div>
                            </div>
                        )
                    }
                }
            })
            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friend</span>
                    <img
                        className="imgWaveHand"
                        src={images.ic_wave_hand}
                        alt="wave hand"
                    />
                </div>
            )
        }
    }

    render() {
        return <div>
            {this.renderListMessage()}
        </div>
    }


}

export default ChatList;
