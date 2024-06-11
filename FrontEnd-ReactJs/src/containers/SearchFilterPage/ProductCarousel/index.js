import React from 'react';
import { Carousel } from 'antd';
import './index.scss';

// Define the list of carousel images
const list = [
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1609752561/saleOff/carousels/unnamed_2_d2ccjd.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1609752560/saleOff/carousels/unnamed_flqfng.webp',
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/v1609752560/saleOff/carousels/unnamed_1_t5luv4.webp',
];

class ProductCarousel extends React.Component {
    render() {
        return (
            <Carousel className="Product-Carousel m-tb-24 bor-rad-8" autoplay>
                {/* Map over the list of images and render them */}
                {list.map((item, index) => (
                    <div key={index}>
                        <img
                            className="Product-Carousel-img bor-rad-8"
                            src={item}
                            alt={"Product Carousel"}
                        />
                    </div>
                ))}
            </Carousel>
        );
    }
}

export default ProductCarousel;
