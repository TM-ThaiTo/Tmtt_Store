import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Spin } from 'antd';
import { connect } from 'react-redux';
import { getDeliveryAddress, delDeliveryAddress, putSetDefaultAdress } from '../../../services/addressService';
import AddressAddForm from './AddressAddForm';
import './index.scss'

class AddressUserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleForm: false,
            list: [],
            activeItem: -1,
            updateList: false,
            isLoading: true
        };
    }

    // fn: khi có thay đổi render lại component
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user !== this.props.user || prevState.updateList !== this.state.updateList) {
            this.getDeliveryAddressList();
        }
    }

    // fn: hàm gọi lấy list delivery address đầu tiên
    componentDidMount() {
        this.getDeliveryAddressList();
    }

    // fn: Hàm gọi api lấy list address
    getDeliveryAddressList = async () => {
        const { user } = this.props;
        try {
            this.setState({ isLoading: true });
            const response = await getDeliveryAddress(user.id_account);
            if (response && response.code === 0) {
                this.setState({
                    list: response.data.list,
                    isLoading: false,
                });
            }
            else if (response.code === 3) {
                this.setState({
                    list: response.data.list,
                    isLoading: false,
                });
            }
            else {
                message.error(response.message, 3);
            }
        } catch (error) {
            console.error("Lỗi lấy địa chỉ nhận hàng", error);
            this.setState({ list: [], isLoading: false });
        }
    };

    // fn: Hàm gọi api và xữ lý xoá delivery address
    onDelDeliveryAdd = async (item) => {
        try {
            const { user } = this.props;
            const response = await delDeliveryAddress(user.id_account, item);
            if (response && response.code === 0) {
                message.success('Xoá địa chỉ thành công');
                this.setState({ updateList: !this.state.updateList });
            }
            else {
                message.error(response.message, 3);
            }
        } catch (error) {
            message.error('Xoá địa chỉ giao, nhận thất bại.');
        }
    };

    // fn: Hàm set default delivery address
    onSetDefaultDeliveryAdd = async (item) => {
        try {
            const { user } = this.props;
            const response = await putSetDefaultAdress(user.id_account, item);
            if (response && response.code === 0) {
                message.success('Cập nhật thành công');
                this.setState({ updateList: !this.state.updateList });
            }
            else {
                message.error(response.message, 3);
            }
        } catch (error) {
            message.error('Cập nhật thất bại.');
        }
    };

    // fn: Hàm show danh sách delivery address
    showAddressList = (list) => {
        return (
            list &&
            list.map((item, index) => (
                <div
                    className={`box-sha-home-address-form 
                    ${this.state.activeItem === index && this.props.isCheckout ? 'item-active' : ''}`}
                    onClick={() => {
                        message.success("Đã chọn địa chỉ nhận hàng", 1);
                        if (this.props.isCheckout) {
                            this.setState({ activeItem: index });
                            this.props.onChecked(index);
                        }
                    }}
                    key={index}
                >
                    <div className="d-flex justify-content-between m-b-4">
                        <h3>
                            <b>{item.name}</b>
                            {index === 0 && !this.props.isCheckout && (
                                <span
                                    className="font-size-12px p-tb-4 p-lr-8 m-l-8 bor-rad-4"
                                    style={{ border: 'solid 1px #3a5dd9', color: '#3a5dd9' }}>
                                    Mặc định
                                </span>
                            )}
                        </h3>
                        {index !== 0 && !this.props.isCheckout && (
                            <div>
                                {/* <Button type="link" onClick={() => this.onSetDefaultDeliveryAdd(index)}>
                                    Đặt mặc định
                                </Button> */}
                                <Button
                                    danger
                                    type="primary"
                                    disabled={index === 0}
                                    onClick={() => this.onDelDeliveryAdd(item.id)}>
                                    Xoá
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="m-b-6">
                        <b>Địa chỉ:</b> {item.address}
                    </p>
                    <p className="m-b-6">
                        <b>Số điện thoại:</b> {item.phone}
                    </p>
                </div>
            ))
        );
    };

    // fn: render
    render() {
        const { isLoading, list, isVisibleForm } = this.state;
        return (
            <>
                {isLoading ? (
                    <div className="t-center m-tb-48">
                        <Spin tip="Đang tải danh sách địa chỉ giao hàng ..." size="large" />
                    </div>
                ) : (
                    <>
                        {list && list.length > 0 ? (
                            <>
                                <Button
                                    type="dashed"
                                    size="large"
                                    className="w-100"
                                    onClick={() => this.setState({ isVisibleForm: true })}
                                    style={{ height: 54 }}>
                                    <PlusOutlined />
                                    Thêm địa chỉ
                                </Button>
                                <div className="m-t-16">{this.showAddressList(list)}</div>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="dashed"
                                    size="large"
                                    className="w-100"
                                    onClick={() => this.setState({ isVisibleForm: true })}
                                    style={{ height: 54 }}>
                                    <PlusOutlined />
                                    Thêm địa chỉ
                                </Button>
                                <h3 className="m-t-16 t-center" style={{ color: '#888' }}>
                                    Hiện tại bạn chưa có địa chỉ giao, nhận hàng nào
                                </h3>
                            </>
                        )}
                    </>
                )}

                {/* modal create address */}
                {isVisibleForm && (
                    <AddressAddForm
                        onCloseForm={(addFlag) => {
                            if (addFlag) this.setState({ updateList: !this.state.updateList });
                            this.setState({ isVisibleForm: false });
                        }}
                    />
                )}
            </>

        );
    }
}

AddressUserList.defaultProps = {
    isCheckout: false,
    onChecked: () => { },
};

AddressUserList.propTypes = {
    isCheckout: PropTypes.bool,
    onChecked: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps)(AddressUserList);
