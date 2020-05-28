import moment from 'moment'
import React, { Component } from 'react'
import images from '../Images/Images';
import gifImages from '../Images/Gifs';

class Stickers extends Component {
    constructor(props) {
        super(props)
    }

    onSendMessage(gifName) {
        this.props.onSendMessage(gifName)
    }
    renderStickers = () => {
        let viewGifImages = [];
        gifImages.forEach(element => {
            console.log(element)
            viewGifImages.push(
                <img
                    key={element}
                    className="imgSticker"
                    src={element}
                    alt="sticker"
                    onClick={() => this.onSendMessage(element)}
                />
            )
        })

        return viewGifImages;

    }
    render() {
        return (
            <div className="viewStickers">
                {

                    this.renderStickers()
                }
                {/* <img
                    className="imgSticker"
                    src={images.mimi1}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi1')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi2}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi2')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi3}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi3')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi4}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi4')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi5}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi5')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi6}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi6')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi7}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi7')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi8}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi8')}
                />
                <img
                    className="imgSticker"
                    src={images.mimi9}
                    alt="sticker"
                    onClick={() => this.onSendMessage('mimi9')}
                />*/}
            </div>
        );
    }
}

export default Stickers;
