import React, { Component } from "react";
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { db, ref, push, onValue, set } from '../../../../config/firebase-config';
import defaultAvt from '../../../../assets/imgs/default-avt.png'
import Avatar from 'antd/lib/avatar/avatar';

class ContentMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: [],
            nameDB: '',
            length: 1000,
        };
        this.mainChatRef = React.createRef();
    }

    // event: hàm khởi tạo
    // => hàm thiết lập các thuộc tính ban đầu
    componentDidMount() {
        if (this.props.database) {
            this.setState({ nameDB: this.props.database });
            this.listenForMessages(this.props.database);
        }
    }

    // event: update lại tin nhắn
    // => liên tục kiểm tra sự thay đổi để cập nhật tin nhắn mới nhất 
    componentDidUpdate(prevProps) {
        if (this.props.database !== prevProps.database) {
            // Nếu tồn tại đường dẫn database cũ, ngắt kết nối
            if (prevProps.database) {
                const previousDatabaseRef = ref(db, prevProps.database);
                const previousCallback = (snapshot) => { }; // Hàm callback trống để ngắt kết nối
                onValue(previousDatabaseRef, previousCallback); // Ngắt kết nối
            }

            // Tiến hành cập nhật state với đường dẫn database mới
            if (this.props.database) {
                this.setState({ nameDB: this.props.database });
                this.listenForMessages(this.props.database);
            }
        }
    }

    // fn: Hàm nghe tin nhắn
    listenForMessages = (nameDB) => {
        try {
            if (this.props.isContentMessage === nameDB) {
                onValue(ref(db, nameDB), (snapshot) => {
                    const messagesObject = snapshot.val();
                    if (messagesObject) {
                        const messages = Object.keys(messagesObject).map(key => ({
                            id: key,
                            ...messagesObject[key]
                        }));

                        if (this.props.isContentMessage === nameDB) {
                            // Lọc ra các tin nhắn của user và chưa đọc
                            const userMessages = messages.filter(message => message.status === "unread");

                            // Cập nhật trạng thái của các tin nhắn user từ "unread" sang "read"
                            userMessages.forEach(message => {
                                const messageRef = ref(db, `${nameDB}/${message.id}`);
                                set(messageRef, { ...message, status: "read" })
                                    .then(() => {

                                    })
                                    .catch(error => {
                                        console.log("Lỗi cập nhật tin nhắn: ", error)
                                    });
                            });
                            this.setState({ messages });
                        }
                    } else {
                        this.setState({ messages: [] });
                    }
                });
            }
            else {
                return;
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // event: cập nhật mess
    handleMessageChange = (e) => {
        this.setState({ message: e.target.value });
    };

    // fn: Hàm gửi tin nhắn
    sendMessage = async () => {
        const { nameDB, message } = this.state;
        if (message.trim() !== '') {
            try {
                await push(ref(db, nameDB), {
                    user: "admin",
                    message: message.trim(),
                    time: Date.now(),
                    room: "test",
                    status: "unread",
                });
                this.setState({ message: '' });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // event: sự kiện nhấn submit
    handleSubmit = (e) => {
        e.preventDefault();
        this.sendMessage();
    };

    // event: sự kiến nhấn enter
    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    };

    // render
    render() {
        const { length } = this.state;
        return (
            <div className="Message">
                <div className="Container-Message">
                    <div className="Content-Message">
                        <div className="Name">
                            <Avatar src={defaultAvt} className="avt-Name" />
                            <span className="title-Name">{this.state.nameDB}</span>
                        </div>

                        <div className='Main-Chat-Modal' ref={this.mainChatRef}>
                            <main className='Main-Chat'>
                                <div className='Main-Message'>
                                    {this.state.messages.map((msg) => {
                                        const messageClass = msg.user === 'admin' ? 'message-block  message-block-right' : 'message-block message-block-left';
                                        return (
                                            <div key={msg.id} className={messageClass}>
                                                {msg.user !== 'admin' && <UserOutlined />}
                                                {msg.message}
                                                {msg.user === 'admin' && <UserOutlined />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </main>
                        </div>

                        <div className="Message-Send-Input">
                            <form onSubmit={this.handleSubmit} className='Form'>
                                <div className='Message'>
                                    <textarea
                                        className="Message-Input"
                                        value={this.state.message}
                                        onChange={this.handleMessageChange}
                                        onKeyDown={this.handleKeyDown}
                                        placeholder="Nhập tin nhắn của bạn..."
                                        maxLength={length}
                                    />
                                </div>
                                <div className='Send'>
                                    <button type="submit" className="Send-Button"><SendOutlined /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContentMessages;
