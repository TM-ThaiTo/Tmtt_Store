import React, { Component } from "react";
import NavBar from "./Navbar";
import HeaderChat from './HeaderChat';
import './index.scss';

class ChatUser extends Component {
    render() {
        return (
            <>
                <div className="ChatUser-Container">
                    <div className="ChatUser-content">
                        <HeaderChat />
                        <div className="content">
                            <NavBar />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ChatUser;
