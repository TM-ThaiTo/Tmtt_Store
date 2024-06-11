import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import truckIcon from '../../../assets/icon/truck_24px.png';
import truckIcon_2 from '../../../assets/icon/truck-2_24px.png';
import okIcon from '../../../assets/icon/ok_24px.png';
import returnProductIcon from '../../../assets/icon/return-product_24px.png';
import wrenchIcon from '../../../assets/icon/wrench_24px.png';
import guaranteeIcon from '../../../assets/icon/guarantee_24px.png';
import './index.scss'

class ProductPolicy extends Component {

    render() {
        return (
            <div className="bg-white p-12 policy">
                <div style={{ color: '#53C303' }} className="ship">
                    <img src={truckIcon} className="icon" alt="" />
                    Sản phẩm được miến phí giao hàng
                </div>

                <h3 className="title-chinh-sach">Chính sách bán hàng</h3>
                <div className="title">
                    <img src={okIcon} className="icon" alt="" />
                    Cam kết chính hãng 100%
                </div>

                <div className="title">
                    <img src={truckIcon_2} className="icon" alt="" />
                    Miễn phí giao hàng từ 700k
                </div>

                <div className="title">
                    <img src={returnProductIcon} className="icon" alt="" />
                    Đổi trả miễn phí trong 7 ngày
                </div>

                <h3 className="title-chinh-sach">Dịch vụ thêm</h3>
                <div className="title">
                    <img src={guaranteeIcon} className="icon" alt="" />
                    Miễn phí bảo hành tại nhà
                </div>
                <div className="title">
                    <img src={wrenchIcon} className="icon" alt="" />
                    Sửa chữa đồng giá 149.000đ
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductPolicy));
