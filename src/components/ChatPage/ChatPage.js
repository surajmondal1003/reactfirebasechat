import moment from 'moment'
import React, { Component } from 'react'
import Loader from 'react-loader-spinner';
import { myFirestore, myStorage } from '../../config/firebaseConfig';
import images from '../Images/Images';
import './ChatPage.css'
import { toast } from '../../../node_modules/react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ChatList from '../ChatList/ChatList';
import Stickers from '../Stickers/Stickers';
import { exportDefaultSpecifier } from '../../../node_modules/@babel/types';


export default class ChatPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowSticker: false,
            inputValue: '',
            receiverTyping: false
        }
        this.currentUserId = localStorage.getItem('id')
        this.currentUserName = localStorage.getItem('name')
        this.currentUserImage = localStorage.getItem('photoUrl')
        this.messagesList = []
        this.currentChatRecieverUser = this.props.currentChatRecieverUser
        this.groupChatId = null
        this.removeListener = null
        this.currentPhotoFile = null
        this.types = {
            text: 'text',
            photo: 'photo',
            sticker: 'sticker',
        }
    }

    onKeyboardPress = event => {
        if (event.key === 'Enter') {
            this.onSendMessage(this.state.inputValue, this.types.text);
        }
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    componentDidMount() {
        this.getChatListHistory();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.currentChatRecieverUser) {
            this.currentChatRecieverUser = newProps.currentChatRecieverUser
            this.getChatListHistory()
        }
    }

    componentWillUnmount() {
        if (this.removeListener) {
            this.removeListener()
        }
    }

    getChatListHistory = () => {
        if (this.removeListener) {
            this.removeListener()
        }
        this.messagesList.length = 0
        this.setState({ isLoading: true })

        if (
            this.hashString(this.currentUserId) <=
            this.hashString(this.currentChatRecieverUser.id)
        ) {
            this.groupChatId = `_${this.currentUserId}_${this.currentChatRecieverUser.id}_`
        } else {
            this.groupChatId = `_${this.currentChatRecieverUser.id}_${this.currentUserId}_`
        }

        // Get history and listen new data added
        this.removeListener = myFirestore
            .collection('messages')
            .doc(this.groupChatId)
            .collection(this.groupChatId)
            .onSnapshot(
                snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            this.messagesList.push(change.doc.data())
                        }
                    })
                    this.setState({ isLoading: false })
                },
                err => {
                    toast.warn(err.toString())
                }
            )

        myFirestore
            .collection('messages')
            .where('groupChatId', '==', this.groupChatId)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'modified') {
                        let data = change.doc.data();
                        if (data.user1_id == this.currentUserId && data.user2Typing == true) {
                            this.setState({ receiverTyping: true })
                        }
                        else if (data.user2_id == this.currentUserId && data.user1Typing == true) {
                            this.setState({ receiverTyping: true })
                        }
                        else {
                            this.setState({ receiverTyping: false })
                        }
                    }
                })
            })

    }


    showTyping = (event) => {

        this.setState({ inputValue: event.target.value });
        let user = null;
        myFirestore.collection('messages').doc(this.groupChatId).get().then((doc) => {
            if (doc.exists) {
                user = doc.data();
                console.log(user)
                if (user.user1_id == this.currentUserId) {
                    myFirestore
                        .collection('messages')
                        .doc(this.groupChatId)
                        .update({
                            user1Typing: true
                        })
                        .then(() => {

                        })
                        .catch(err => {
                            toast.warn(err.toString())
                        })
                } else {
                    myFirestore
                        .collection('messages')
                        .doc(this.groupChatId)
                        .update({
                            user2Typing: true
                        })
                        .then(() => {

                        })
                        .catch(err => {
                            toast.warn(err.toString())
                        })
                }

            }
        });


    }

    hashString = str => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    }

    openListSticker = () => {
        this.setState({ isShowSticker: !this.state.isShowSticker })
    }

    onSendMessage = (content, type) => {
        if (this.state.isShowSticker && type === this.types.sticker) {
            this.setState({ isShowSticker: false })
        }

        if (content.trim() === '') {
            return
        }

        const timestamp = moment().valueOf().toString()

        const itemMessage = {
            idFrom: this.currentUserId,
            idTo: this.currentChatRecieverUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        }

        const docCollectionMessage = {
            groupChatId: this.groupChatId,
            user1_id: this.currentUserId,
            user2_id: this.currentChatRecieverUser.id,
            updated_at: timestamp,
            user1Typing: false,
            user2Typing: false,
        }

        myFirestore
            .collection('messages')
            .doc(this.groupChatId)
            .set(docCollectionMessage)
            .then(() => {
                myFirestore
                    .collection('messages')
                    .doc(this.groupChatId)
                    .collection(this.groupChatId)
                    .doc(timestamp)
                    .set(itemMessage)
                    .then(() => {
                        this.setState({ inputValue: '' })
                    })
                    .catch(err => {
                        toast.warn(err.toString())
                    })
            })
            .catch(err => {
                toast.warn(err.toString())
            })


    }



    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
    }

    onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ isLoading: true })
            this.currentPhotoFile = event.target.files[0]
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                this.uploadPhoto()
            } else {
                this.setState({ isLoading: false })
                toast.warn('This file is not an image')
            }
        } else {
            this.setState({ isLoading: false })
        }
    }


    uploadPhoto = () => {
        if (this.currentPhotoFile) {
            const timestamp = moment().valueOf().toString()

            const uploadTask = myStorage.ref().child(timestamp).put(this.currentPhotoFile)

            uploadTask.on('state_changed', null,
                err => {
                    this.setState({ isLoading: false })
                    toast.warn(err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        console.log(downloadURL);
                        this.setState({ isLoading: false })
                        this.onSendMessage(downloadURL, this.types.photo)
                    })
                }
            );

        } else {
            this.setState({ isLoading: false })
            toast.warn('File is null')
        }
    }


    render() {
        return (
            <div className="viewChatBoard">
                {/* Header */}
                <div className="headerChatBoard">
                    <img
                        className="viewAvatarItem"
                        src={this.currentChatRecieverUser.photoUrl}
                        alt="icon avatar"
                    />
                    <span className="textHeaderChatBoard">
                        {this.currentChatRecieverUser.name}
                    </span>
                </div>
                {/* List message */}
                <div className="viewListContentChat">
                    <ChatList messagesList={this.messagesList} currentChatRecieverUser={this.currentChatRecieverUser} />

                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={el => {
                            this.messagesEnd = el
                        }}
                    />
                </div>
                {/* Stickers */}

                {this.state.isShowSticker ? <Stickers onSendMessage={(gifName) => this.onSendMessage(gifName, this.types.sticker)} /> : null}

                {this.state.receiverTyping == true ? <p>{`${this.currentChatRecieverUser.name} is typing`}</p> : null}
                {/* View bottom */}
                <div className="height50"></div>
                <div className="viewBottom">
                    <img
                        className="icOpenGallery"
                        src={images.ic_photo}
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        ref={el => {
                            this.refInput = el
                        }}
                        accept="image/*"
                        className="viewInputGallery"
                        type="file"
                        onChange={this.onChoosePhoto}
                    />

                    <img
                        className="icOpenSticker"
                        src={images.ic_sticker}
                        alt="icon open sticker"
                        onClick={this.openListSticker}
                    />

                    <input
                        className="viewInput"
                        placeholder="Type your message..."
                        value={this.state.inputValue}
                        onChange={event => this.showTyping(event)}
                        onKeyPress={this.onKeyboardPress}
                    />
                    <img
                        className="icSend"
                        src={images.ic_send}
                        alt="icon send"
                        onClick={() => this.onSendMessage(this.state.inputValue, this.types.text)}
                    />
                </div>


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


}