import React, { Component } from 'react';
import { Carousel } from 'antd';
import './index.scss';

const list = [
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/8_ontuqq.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134535/saleOff/carousels/2_b1d6dd.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134534/saleOff/carousels/4_amgb7n.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134535/saleOff/carousels/5_kfuyu2.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134534/saleOff/carousels/1_ggor4n.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134536/saleOff/carousels/6_kt4deu.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134534/saleOff/carousels/3_wwgin5.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/7_gokjlq.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/9_qq407q.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/10_pcgl2j.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/11_vhqqe1.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/12_crycbe.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134778/saleOff/carousels/13_ytp67u.webp',
];

class SaleOff extends Component {
    render() {
        return (
            <Carousel className="Sale-Off" autoplay>
                {list.map((item, index) => (
                    <img className="Sale-Off-img" src={item} key={index} alt={`carousel-${index}`} />
                ))}
            </Carousel>
        );
    }
}

export default SaleOff;
