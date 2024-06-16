import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import Posts from './Posts';
import Specification from './Specification';
import './index.scss';

class Description extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isHideDesc: false,
            isShowSeeMore: false,
        };
    }

    // ev: hiển thị xem thêm bài viết chi tiết
    onSeeMore = () => {
        this.setState((prevState) => ({
            isHideDesc: !prevState.isHideDesc,
        }));
    };

    // ev: lấy kích thước bài viết mô tả sau khi render
    componentDidMount() {
        const height = document.getElementById('descId').clientHeight;
        // Nếu chiều cao bài viết > 200px thì ẩn bớt
        if (height >= 200) {
            this.setState({
                isShowSeeMore: true,
            });
        }
    }

    render() {
        const { detail, desc } = this.props;
        const { isHideDesc, isShowSeeMore } = this.state;

        return (
            <Row className="Product-Desc bg-white p-8" id="descId">
                {/* Bài viết chi tiết */}
                <Col
                    span={24}
                    md={14}
                    className={`p-8 ${!isHideDesc ? 'hide-desc' : ''}`}>
                    <Posts desc={desc} />
                </Col>

                {/* Thông số kỹ thuật */}
                <Col span={24} md={10} className={`p-8 ${!isHideDesc ? 'hide-desc' : ''}`} >
                    <h2 className="font-weight-700">Thông số kỹ thuật</h2>
                    <div className="underline-title"></div>
                    <Specification detail={detail} />
                </Col>

                {/* hiển thị chế độ xem thêm */}
                {isShowSeeMore && (
                    <h3 className="trans-margin p-tb-16 see-more ease-trans" onClick={this.onSeeMore}>
                        {isHideDesc ? 'Thu gọn ' : 'Xem thêm '}
                        nội dung &nbsp;
                        {isHideDesc ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    </h3>
                )}
            </Row>
        );
    }
}

Description.propTypes = {
    detail: PropTypes.object,
    desc: PropTypes.object,
};

export default Description;
