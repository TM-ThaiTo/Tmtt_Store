import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import cameraIcon from '../../../assets/icon/products/camera_32px.png'
import displayIcon from '../../../assets/icon/products/display_32px.png';
import hdtvIcon from '../../../assets/icon/products/hdtv_32px.png';
import headphoneIcon from '../../../assets/icon/products/headphones_32px.png';
import laptopIcon from '../../../assets/icon/products/laptop_32px.png';
import mainboardIcon from '../../../assets/icon/products/mainboard_32px.png';
import mobileIcon from '../../../assets/icon/products/mobile_32px.png';
import mouseIcon from '../../../assets/icon/products/mouse_32px.png';
import ramIcon from '../../../assets/icon/products/ram_32px.png';
import routerIcon from '../../../assets/icon/products/router_32px.png';
import speakerIcon from '../../../assets/icon/products/speaker_32px.png';
import ssdIcon from '../../../assets/icon/products/ssd_32px.png';
import keyboardIcon from '../../../assets/icon/products/keyboard_32px.png';

class MenuFilter extends Component {
    renderFilterMenu(list) {
        // const { onShow } = this.props;
        return (
            list &&
            list.map((item, index) => {
                return (
                    <div
                        // onMouseEnter={() => onShow(item.key)} // chưa làm được filter kia nên tạm để đó
                        key={index}
                        className="w-100 p-lr-8 p-tb-4  Filter-menu-item">
                        <Link to={item.to} className="d-flex align-i-center">
                            <img src={item.icon} className="icon m-lr-8" alt={item.title} />
                            <span className="title">{item.title}</span>
                        </Link>
                    </div>
                );
            })
        );
    }

    render() {
        return <div className="bor-rad-8 Filter-menu p-tb-4">{this.renderFilterMenu(menu)}</div>;
    }
}

MenuFilter.propTypes = {
    onShow: PropTypes.func,
};

// fn: menu danh sách filter
const menu = [
    {
        key: 5,
        to: '/filter?t=5',
        icon: laptopIcon,
        title: 'Laptop & Macbook',
    },
    {
        key: 3,
        to: '/filter?t=3',
        icon: ssdIcon,
        title: 'Ổ cứng',
    },
    {
        key: 7,
        to: '/filter?t=7',
        icon: ramIcon,
        title: 'RAM',
    },
    {
        key: 12,
        to: '/filter?t=12',
        icon: hdtvIcon,
        title: 'Màn hình',
    },
    {
        key: 4,
        to: '/filter?t=4',
        icon: displayIcon,
        title: 'Card màn hình',
    },
    {
        key: 9,
        to: '/filter?t=9',
        icon: mobileIcon,
        title: 'Điện thoại - Phụ kiện',
    },
    {
        key: 13,
        to: '/filter?t=13',
        icon: mouseIcon,
        title: 'Chuột máy tính',
    },
    {
        key: 11,
        to: '/filter?t=11',
        icon: keyboardIcon,
        title: 'Bàn phím',
    },
    {
        key: 10,
        to: '/filter?t=10',
        icon: headphoneIcon,
        title: 'Tai nghe',
    },
    {
        key: 14,
        to: '/filter?t=14',
        icon: routerIcon,
        title: 'Router - Thiết bị mạng',
    },
    {
        key: 15,
        to: '/filter?t=15',
        icon: speakerIcon,
        title: 'Loa - Âm thanh',
    },
    {
        key: 1,
        to: '/filter?t=1',
        icon: cameraIcon,
        title: 'Máy ảnh - Camera',
    },
    {
        key: 8,
        to: '/filter?t=8',
        icon: mainboardIcon,
        title: 'Mainboard - Bo mạch chủ',
    },
];

export default MenuFilter;
