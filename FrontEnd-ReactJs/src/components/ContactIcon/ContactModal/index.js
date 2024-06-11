import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { SendOutlined, CloseCircleOutlined, RobotOutlined } from '@ant-design/icons';
import { db, ref, push, onValue } from '../../../config/firebase-config';
import { postChatPy } from '../../../services/chatBotService';
import { message } from 'antd';
import logo from '../../../assets/Logo/Logo.png';
import constants from '../../../constants';
import './index.scss';

class ContactModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameDB: '',
            nameUser: '',
            message: '',
            messages: [],
            maxLength: 200,
            isChatAdmin: false,
            isFirstMessageSent: false,
            messages_GPT: [],
        };
        this.mainChatRef = React.createRef();
        this.unsubscribe = null;
    }

    //#region Hàm xử lý chức năng
    // fn: Hàm gán giá trị khởi đầu
    componentDidMount() {
        const { user, isAuth } = this.props;
        let nameDB, nameUser;

        // nếu người dùng đăng nhập rồi thì lấy đoạn chat của người dùng
        if (isAuth) {
            const nameEmail = this.extractUsername(user.email);
            nameDB = nameEmail;
            nameUser = user.fullName;
            // Lưu giá trị nameDB vào localStorage
            localStorage.setItem('nameDB', nameDB);
        }
        this.setState({
            nameDB: nameDB,
            nameUser: nameUser
        });
        this.listenForMessages(nameDB);
    }
    // fn: Hàm lắng nghe và cập nhật tin nhắn
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

                    // gửi tin nhắn mẫu khi người dùng lần đầu tiên nhắn đến 
                    if (messages.length === 1) {
                        this.sendMessageToDefaultUser(nameDB);
                    }
                } else {
                    this.setState({ messages: [] });
                }
            });
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // fn: Hàm mặc định đoạn tin nhắn đầu tiên
    sendMessageToDefaultUser = async (nameDB) => {
        try {
            const userSend = "admin";
            const firstMessagetoAdmin = "Cảm ơn bạn đã liên hệ với TMTT Store sẽ mất vài phút để nhân viên tư vấn phản hồi.";
            const seconMessagetoAdmin = "Để đảm bảo tin nhắn không bị mất vui lòng đăng nhập. Xin cảm ơn";
            await push(ref(db, nameDB), {
                user: userSend,
                message: firstMessagetoAdmin,
                time: Date.now(),
                room: nameDB,
                status: 'unread',
            });

            // Gửi tin nhắn thứ hai
            await push(ref(db, nameDB), {
                user: userSend,
                message: seconMessagetoAdmin,
                time: Date.now() + 1, // Thêm một khoảng thời gian nhỏ để đảm bảo tin nhắn thứ hai hiển thị sau tin nhắn thứ nhất
                room: nameDB,
                status: 'unread',
            });
        } catch (error) {
            console.error('Error sending message to default user:', error);
        }
    }

    // fn: hàm tách tên email thành tên riêng
    extractUsername = (email) => {
        return email.includes('@') ? email.split('@')[0] : email;
    }

    handleMessageChange = (e) => {
        this.setState({ message: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.sendMessage();
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    };
    //#endregion

    //#region Chat với admin
    // fn: Hàm gửi tin nhắn với Admin
    sendAdmin = async () => {
        const newMessage = this.state.message.trim();
        const { nameDB, nameUser } = this.state;
        if (newMessage) {
            try {
                await push(ref(db, nameDB), {
                    user: nameUser,
                    message: newMessage,
                    time: Date.now(),
                    room: nameDB,
                    status: 'unread',
                });
                this.setState({ message: '' });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

    // fn: hàm gửi tin nhắn
    sendMessage = async () => {
        const { isAuth } = this.props;
        const { isChatAdmin } = this.state;
        if (isAuth === true && isChatAdmin === true) {
            this.sendAdmin();
            return;
        }
        this.sendBot();
    };

    // fn: Hàm chuyển trạng thái chat với Admin
    handleChatAdmin = () => {
        if (this.props.isAuth === false) {
            message.error("Vui lòng đăng nhập để chat với admin", 3);
            return;
        }
        this.setState({
            isChatAdmin: true,
        })
    }
    //#endregion

    //#region Chat với bot
    // fn: Hàm chuyển trạng thái sang chat với Bot
    handleChatBot = () => {
        this.setState({
            isChatAdmin: false
        })
    }
    // fn: Hàm gửi tin nhắn với Bot
    // sendBot = async () => {
    //     const newMessage = this.state.message.trim();
    //     if (!newMessage.trim()) return;

    //     // // Nếu đây là tin nhắn đầu tiên của người dùng, thêm tin nhắn mẫu vào trạng thái
    //     // if (!this.state.isFirstMessageSent) {
    //     //     this.setState(prevState => ({
    //     //         messages_GPT: [
    //     //             ...prevState.messages_GPT,
    //     //             {
    //     //                 role: 'user',
    //     //                 content: newMessage
    //     //             },
    //     //             ...constants.LIST_QUESTION_CHATBOT,
    //     //         ],
    //     //         message: '',
    //     //         isFirstMessageSent: true
    //     //     }));
    //     //     return;
    //     // }
    //     // // Append user message
    //     // this.setState(prevState => ({
    //     //     messages_GPT: [
    //     //         ...prevState.messages_GPT,
    //     //         {
    //     //             role: 'user',
    //     //             content: newMessage
    //     //         }
    //     //     ],
    //     //     message: ''
    //     // }), async () => {
    //     //     try {
    //     //         this.setState({ isLoading: true });

    //     //         // Send API request to OpenAI endpoint
    //     //         const response = await postChatGPT(this.state.messages_GPT);

    //     //         // Append ChatGPT response
    //     //         this.setState(prevState => ({
    //     //             messages_GPT: [
    //     //                 ...prevState.messages_GPT,
    //     //                 {
    //     //                     role: 'assistant',
    //     //                     content: response.data.choices[0].message.content
    //     //                 }
    //     //             ],
    //     //             isLoading: false
    //     //         }));
    //     //     } catch (error) {
    //     //         console.error('There was an error with the API request', error);
    //     //     } finally {
    //     //         this.setState({ isLoading: false });
    //     //     }
    //     // });
    // }
    sendBot = async () => {
        const newMessage = this.state.message.trim();

        // Check for empty message and initial message scenario
        if (!newMessage || (!this.state.isFirstMessageSent && !constants.LIST_QUESTION_CHATBOT.length)) {
            return;
        }
        //  Nếu đây là tin nhắn đầu tiên của người dùng, thêm tin nhắn mẫu vào trạng thái
        if (!this.state.isFirstMessageSent) {
            this.setState(prevState => ({
                messages_GPT: [
                    ...prevState.messages_GPT,
                    {
                        role: 'user',
                        content: newMessage
                    },
                    ...constants.LIST_QUESTION_CHATBOT,
                ],
                message: '',
                isFirstMessageSent: true
            }));
            return;
        }
        try {
            this.setState({ isLoading: true });
            this.setState(prevState => ({
                messages_GPT: [
                    ...prevState.messages_GPT,
                    { role: 'user', content: newMessage },
                ],
                message: '',
            }));
            const response = await postChatPy(newMessage);
            if (response) {
                const message = response.data.response;
                this.setState(prevState => ({
                    messages_GPT: [
                        ...prevState.messages_GPT,
                        { role: 'assistant', content: message },
                    ],
                    isLoading: false,
                }));
            } else {
                console.error('Error receiving response from chatbot API');
            }
        } catch (error) {
            console.error('There was an error with the API request:', error);
        } finally {
            this.setState({ isLoading: false });
        }
    };
    //#endregion

    // redering
    render() {
        const { maxLength, isChatAdmin } = this.state;
        const { isAuth } = this.props;
        return ReactDOM.createPortal(
            <div className="Contact-Modal-Container">
                <div className="Contact-Modal">
                    <div className="Modal-Content">
                        <div className='Top-Modal'>
                            {/* Title */}
                            <div className='Title-Modal'>
                                <div className='Logo'>
                                    <img src={logo} alt="Logo" />
                                </div>

                                {/* tiêu đề chat */}
                                <div className='Title'>
                                    {isAuth === true && isChatAdmin === true ? (
                                        <h4>Chat với admin</h4>
                                    ) : (
                                        <h4>Chat với Bot</h4>
                                    )}
                                </div>
                            </div>

                            {/* chat vói bot */}
                            <div className='Change-Chat-Admin-Bot'>
                                <button className="Change-Button" onClick={this.handleChatBot}><RobotOutlined /></button>
                            </div>
                            {/* chat với admin */}
                            <div className='Change-Chat-Admin-Bot'>
                                <button className="Change-Button" onClick={this.handleChatAdmin}><i class="fas fa-user-cog"></i></button>
                            </div>
                            {/* button Close */}
                            <div className='Close-Modal'>
                                <button className="Close-Button" onClick={this.props.onClose}><CloseCircleOutlined /></button>
                            </div>
                        </div>

                        {/* Main Chat */}
                        <div>
                            {isAuth === true && isChatAdmin === true ? (
                                <div className='Main-Chat-Modal' ref={this.mainChatRef}>
                                    <main className='Main-Chat'>
                                        <div className='Main-Message'>
                                            {this.state.messages.map((msg, index) => {
                                                const messageClass = msg.user === 'admin' ? 'message-block  message-block-left' : 'message-block message-block-right';
                                                return (
                                                    <div key={index} className={messageClass}>
                                                        {msg.user !== 'admin' && msg.message}
                                                        {msg.user === 'admin' && msg.message}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </main>
                                </div>
                            ) : (
                                <div className='Main-Chat-Modal' ref={this.mainChatRef}>
                                    <main className='Main-Chat'>
                                        <div className='Main-Message'>
                                            {this.state.messages_GPT.map((msg, index) => {
                                                if (msg.role !== 'system') {
                                                    const messageClass = msg.role === 'assistant' ? 'message-block message-block-left' : 'message-block message-block-right';
                                                    return (
                                                        <div key={index} className={messageClass}>
                                                            {msg.content}
                                                        </div>
                                                    );
                                                }
                                                return null; // Bỏ qua tin nhắn của role 'system'
                                            })}
                                            {this.state.isLoading && (
                                                <div className="message-block message-block-left">
                                                    <span className="ellipsis">...</span>
                                                </div>
                                            )}
                                        </div>
                                    </main>
                                </div>
                            )}
                        </div>

                        {/* Input-Send */}
                        <div className='Message-Send-Input'>
                            <form onSubmit={this.handleSubmit} className='Form'>
                                <div className='Message'>
                                    <textarea
                                        className="Message-Input"
                                        value={this.state.message}
                                        onChange={this.handleMessageChange}
                                        onKeyDown={this.handleKeyDown}
                                        placeholder="Nhập tin nhắn của bạn..."
                                        maxLength={maxLength}
                                    />
                                </div>
                                <div className='Send'>
                                    <button type="submit" className="Send-Button"><SendOutlined /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    }
}

const mapStateToProps = state => ({
    isAuth: state.authenticate.isAuth,
    user: state.user,
});

export default connect(mapStateToProps, null)(ContactModal);
