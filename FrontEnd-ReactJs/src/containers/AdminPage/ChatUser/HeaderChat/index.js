import React, { Component } from "react";
import IconChat from '../../../../assets/icon/icon-hỗ-trợ-khách-hàng.png';
import '../index.scss';
class HeaderChat extends Component {
    render() {
        return (
            <div className="Header-Chat">
                <img src={IconChat} width={90} height={80} alt="Logo" />
                <span className="title-tu-van">Liên hệ với khách hàng</span>
            </div>
        );
    }
}
export default HeaderChat;
