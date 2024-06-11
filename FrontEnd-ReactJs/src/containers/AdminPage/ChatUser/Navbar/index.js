import React, { Component } from "react";
import { db, ref, onValue, get } from '../../../../config/firebase-config';
import { Menu, Spin, Badge, message, Input } from "antd";
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import ContentMessages from "../Message";
import './index.scss'

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            databaseList: {
                nameDB: '',
                lateMessage: '',
            },
            loading: true,
            isLoaded: false,
            selectedDatabase: null,
            selectedContentMessages: null,
            isContentMessage: "",
            newMessages: {},
            valueSearchChat: '',
        };
    }

    //#region Chức năng chat với firebase

    // event: khởi tạo
    componentDidMount() {
        this.handleUpdateDatabaseChat();
    }

    // fn: Hàm cập nhật database
    // => Hàm gọi đầu tiên để lấy danh sách các đoạn chat khi mới vào component
    // => chỉ lấy tên database các đoạn chat
    handleUpdateDatabaseChat = () => {
        const databaseRef = ref(db);
        onValue(databaseRef, async (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const databaseList = Object.keys(data);
                const databaseInfoPromises = databaseList.map(async databaseName => {
                    const databaseMessagesRef = ref(db, databaseName);
                    const messagesSnapshot = await get(databaseMessagesRef);
                    const messages = messagesSnapshot.val();
                    if (messages) {
                        // Lấy tin nhắn mới nhất
                        const newestMessage = Object.values(messages).reduce((prev, current) => {
                            return (prev.timestamp > current.timestamp) ? prev : current;
                        }, {});
                        return { nameDB: databaseName, lateMessage: newestMessage.message };
                    } else {
                        return { nameDB: databaseName, lateMessage: null };
                    }
                });

                // Đợi cho tất cả các promises hoàn thành
                const databaseInfoList = await Promise.all(databaseInfoPromises);

                this.setState({ databaseList: databaseInfoList, loading: false });
                this.listenForNewMessages(databaseInfoList);
            } else {
                this.setState({ databaseList: [], loading: false });
            }
        });
    }

    // fn: Update liên tục
    componentDidUpdate(prevProps, prevState) {
        if (prevState.isLoaded && this.state.databaseList.length > prevState.databaseList.length) {
            message.success("Có đoạn chat mới");
        }
    }

    // fn: Hàm lắng nghe thay đổi database 
    // => Hàm cập nhật các đoạn chat mới nhất
    listenForNewMessages = (databaseList) => {
        const { selectedDatabase } = this.state;
        this.setState({ isLoaded: true });
        try {
            databaseList.map(database => {
                const { nameDB } = database;
                const databaseMessagesRef = ref(db, nameDB);
                onValue(databaseMessagesRef, (snapshot) => {
                    const messages = snapshot.val();
                    const { newMessages } = this.state;

                    if (messages) {
                        // Kiểm tra database có tin nhắn nào có status unread không
                        const hasNewMessages = Object.values(messages).some(message => {
                            return message.status === "unread";
                        });

                        if (selectedDatabase !== nameDB) {
                            newMessages[nameDB] = hasNewMessages;
                        } else {
                            newMessages[nameDB] = false;
                        }
                        this.setState({ newMessages: newMessages });
                    } else {
                        newMessages[nameDB] = false;
                    }
                });
                return null; // Thêm câu lệnh return để loại bỏ cảnh báo
            });
        } catch (error) {
            console.log("lỗi navbar: ", error);
        }
    };

    // fn: Hàm đổi database
    handleDatabaseClick = (databaseName) => {
        this.setState({ selectedDatabase: databaseName, isContentMessage: databaseName });
        // Đánh dấu không còn tin nhắn mới khi người dùng chọn database này
        const { newMessages } = this.state;
        newMessages[databaseName] = false;
        this.setState({ newMessages });
    };

    handleContentMessagesClick = (contentMessagesName) => {
        this.setState({ selectedContentMessages: contentMessagesName });
    };
    //#endregion

    //#region Chức năng tìm kiếm
    // fn: Hàm thay đổi giá trị tìm kiếm
    handleChangeValueSearch = (e) => {
        this.setState({
            valueSearchChat: e.target.value,
        });
    }

    // event: Sự kiện reset tìm kiếm
    handleResetSearch = () => {
        this.setState({ valueSearchChat: '' });
        this.handleUpdateDatabaseChat();
    }

    // fn: Hàm tìm kiếm tên database đoạn chat
    searchDBChat = async () => {
        const { valueSearchChat } = this.state;
        try {
            const databaseRef = ref(db);
            onValue(databaseRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const results = Object.keys(data).filter(databaseName => {
                        // Tìm kiếm trong tên của các database
                        return databaseName.includes(valueSearchChat);
                    });
                    this.setState({ databaseList: results });
                } else {
                    console.log("No data found.");
                    this.setState({ databaseList: [] }); // Đặt lại databaseList nếu không có dữ liệu tìm thấy
                }
            });
        } catch (error) {
            console.error('Error querying Firebase database:', error);
        }
    }

    // event: Sự kiện tìm kiếm 
    handleSumitSearch = async () => {
        const { valueSearchChat } = this.state;
        if (!valueSearchChat) return;
        this.searchDBChat();
    }
    //#endregion

    // render
    render() {
        const { databaseList, loading, selectedDatabase, selectedContentMessages, newMessages, valueSearchChat } = this.state;
        return (
            <>
                <div className="menu-chat">
                    {/* chức năng */}
                    <div className="chucnang-chat">
                        <div className="title-danhsach">
                            <span className="title-doanchat">Đoạn chat</span>
                            <i className="fas fa-comment-dots icon-doanchat"></i>
                        </div>

                        <div className="search">
                            <Input
                                placeholder='Nhập tên đoạn chat'
                                value={valueSearchChat}
                                onChange={this.handleChangeValueSearch}
                                onPressEnter={this.handleSumitSearch}
                            />
                            <div className="btn-search" onClick={this.handleResetSearch} >
                                <RedoOutlined />
                            </div>
                            <div className="btn-search" onClick={this.handleSumitSearch} >
                                <SearchOutlined className="icon-search" />
                            </div>
                        </div>
                    </div>

                    {/* danh sách chat */}
                    <Menu
                        className="menu-item-chat "
                        mode="inline"
                        defaultSelectedKeys={selectedDatabase ? [selectedDatabase] : []}
                        onClick={({ key }) => this.handleDatabaseClick(key)}
                    >
                        {loading ? (
                            <Spin />
                        ) : (
                            databaseList.map((database, index) => (
                                <Menu.Item
                                    className="menu-item-navbar"
                                    key={database.nameDB}
                                >
                                    {selectedDatabase !== database.nameDB ? (
                                        <Badge dot={newMessages[database.nameDB]}>
                                            <span>{database.nameDB}</span>
                                        </Badge>
                                    ) : (
                                        <span>{database.nameDB}</span>
                                    )}
                                </Menu.Item>
                            ))
                        )}
                    </Menu>
                </div>

                {/* sự kiện chọn đoạn chat */}
                {selectedDatabase && !selectedContentMessages && (
                    <ContentMessages
                        database={selectedDatabase}
                        isContentMessage={selectedDatabase}
                    />
                )}
            </>
        );
    }
}

export default NavBar;
