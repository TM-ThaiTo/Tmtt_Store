import React, { Component } from 'react';
import { Badge } from 'antd';
import { db, ref, onValue } from '../../config/firebase-config';
import messageIcon from '../../assets/imgs/logo-message.png';
import ContactModal from './ContactModal';
import './index.scss';

class ContactIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            nameDB: '',
            message: '',
            messages: [],
            countNewMessage: 0,
        };
    }

    // event: khởi tạo đầu tiên
    componentDidMount() {
        const storedNameDB = localStorage.getItem('nameDB');
        if (storedNameDB === "null") {
            return;
        }
        this.setState({ nameDB: storedNameDB });
        this.listenForMessages(storedNameDB);
    }

    // event: cập nhật liên tục tin nhắn 
    componentDidUpdate(prevProps, prevState) {
        const storedNameDB = localStorage.getItem('nameDB');
        if (storedNameDB !== "null") {
            if (storedNameDB && this.state.nameDB !== storedNameDB) {
                this.setState({ nameDB: storedNameDB });
                this.listenForMessages(storedNameDB);
            }

            if (this.state.messages.length !== prevState.messages.length && !this.state.showModal) {
                this.setState(prevState => ({
                    countNewMessage: prevState.countNewMessage + 1
                }));
            }
        }
    }

    listenForMessages = (nameDB) => {
        try {
            onValue(ref(db, nameDB), (snapshot) => {
                const messagesObject = snapshot.val();
                if (messagesObject) {
                    const messages = Object.keys(messagesObject).map(key => ({
                        id: key,
                        ...messagesObject[key]
                    }));
                    this.setState({ messages });
                } else {
                    this.setState({ messages: [] });
                }
            });
        } catch (error) {
            console.log("Error lỗi:", error);
        }
    };

    showModal = () => {
        this.setState({
            showModal: true,
        });
    };

    hideModal = () => {
        this.setState({
            showModal: false,
        });
    };

    toggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            countNewMessage: 0,
        }));
    };

    render() {
        return (
            <div className='blockIcon'>
                <img
                    style={{ opacity: 0.8, cursor: 'pointer' }}
                    alt=''
                    className="Contact-Icon"
                    src={messageIcon}
                    onClick={this.toggleModal}
                />
                <Badge
                    className="badgeIcon"
                    size="small"
                    style={{ color: '#fff' }}
                    count={this.state.countNewMessage}
                    overflowCount={9}
                    offset={[36, -5]}
                />
                {this.state.showModal && <ContactModal onClose={this.toggleModal} />}
            </div>

        );
    }
}

export default ContactIcon;
