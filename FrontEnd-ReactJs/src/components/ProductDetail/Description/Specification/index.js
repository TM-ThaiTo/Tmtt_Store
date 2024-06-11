import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

// Function to convert product keys to Vietnamese
const convertProductKey = (key) => {
    switch (key) {
        case 'chipBrand':
            return 'Nhãn hiệu chip';
        case 'detailCpu':
            return 'Chi tiết CPU';
        case 'disk':
            return 'Ổ cứng';
        case 'display':
            return 'Card màn hình';
        case 'displaySize':
            return 'Màn hình';
        case 'operating':
            return 'Hệ điều hành';
        case 'pin':
            return 'Dung lượng pin';
        case 'processorCount':
            return 'Số lượng nhân';
        case 'ram':
            return 'RAM (GB)';
        case 'series':
            return 'Series';
        case 'warranty':
            return 'Bảo hành';
        case 'weight':
            return 'Khối lượng';
        default:
            return '';
    }
};

class Specification extends Component {
    listSpecification(data) {
        if (!data || typeof data !== 'object') return [];

        const allowedKeys = [
            'chipBrand',
            'detailCpu',
            'disk',
            'display',
            'displaySize',
            'operating',
            'pin',
            'processorCount',
            'ram',
            'series',
            'warranty',
            'weight',
        ];

        return Object.entries(data)
            .filter(([key]) => allowedKeys.includes(key))
            .map(([key, value]) => ({ key: convertProductKey(key), value }));
    }

    // Method to render specification items
    renderSpecification(list) {
        return list.map((item, index) => (
            <div key={index} className="Specification-item d-flex p-12">
                <span className="font-size-16px" style={{ flexBasis: 130 }}>
                    {item.key}
                </span>
                <span className="font-size-16px flex-grow-1">{item.value}</span>
            </div>
        ));
    }

    render() {
        const { detail } = this.props;
        const list = this.listSpecification(detail);

        return (
            <div className="Specification p-t-16">
                {this.renderSpecification(list)}
            </div>
        );
    }
}

Specification.propTypes = {
    detail: PropTypes.object,
};

export default Specification;
