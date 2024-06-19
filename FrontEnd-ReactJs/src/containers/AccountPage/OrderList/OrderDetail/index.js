import React, { Component } from 'react';
import { Modal, Spin, Table, Tooltip, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { getDetailOrder } from '../../../../services/orderService.js'
import helpers from '../../../../helpers/index.js';
import PropTypes from 'prop-types';
import './index.scss';

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            isLoading: true,
            order: null,
        };
    }

    // fn: Hàm khởi chạy đầu tiên
    componentDidMount() {
        this.getOrderDetails();
    }

    // fn: Hàm gọi api và lấy chi tiết order
    async getOrderDetails() {
        try {
            const { orderId } = this.props;
            const response = await getDetailOrder(orderId);
            if (response && response.code === 0) {
                this.setState({
                    order: response.data,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            this.setState({ isLoading: false, order: null });
        }
    }

    // fn: Rendering
    render() {
        const { visible, isLoading, order } = this.state;
        const { onClose } = this.props;

        const columns = [
            {
                title: 'Sản phẩm',
                dataIndex: 'prod',
                key: 'prod',
                render: (v, data) => (
                    <>
                        {data.itemsOrders.map(product => (
                            <div key={product.productId}>
                                <Link to={`/product/${product.productId}`}>
                                    <Tooltip title={product.name}>
                                        {helpers.reduceProductName(product.name, 40)}
                                    </Tooltip>
                                </Link>
                            </div>
                        ))}
                    </>
                ),
            }, // sản phẩm
            {
                title: 'Giá',
                dataIndex: 'price',
                key: 'prod',
                render: (v, record) => (
                    <>
                        {record.itemsOrders.map(product => (
                            <div key={product.productId}>
                                {helpers.formatProductPrice(product.price)}
                            </div>
                        ))}
                    </>
                ),
            }, // Giá
            {
                title: 'Số lượng',
                dataIndex: 'numOfProd',
                key: 'numOfProd',
                render: (v, record) => (
                    <>
                        {record.itemsOrders.map(product => (
                            <div key={product.productId}>
                                {product.stock}
                            </div>
                        ))}
                    </>
                )
            }, // số lượng
            {
                title: 'Giảm giá',
                dataIndex: 'discount',
                key: 'discount',
                render: (v, record) => (
                    <>
                        {record.itemsOrders.map(product => (
                            <div key={product.productId}>
                                {product.discount} %
                            </div>
                        ))}
                    </>
                )
            }, // giảm giá
            {
                title: 'Tạm tính',
                dataIndex: 'totalMoney',
                key: 'totalMoney',
                render: (v, record) => (
                    <>
                        {record.itemsOrders.map(product => (
                            <div key={product.productId}>
                                {helpers.formatProductPrice(
                                    (product.price * product.stock - (product.price * product.stock * product.discount) / 100)
                                )}
                            </div>
                        ))}
                    </>
                ),
            },// tạm tính
        ];

        return (
            <Modal
                width={1000}
                centered
                visible={visible}
                onCancel={() => {
                    this.setState({ visible: false });
                    onClose();
                }}
                maskClosable={false}
                footer={null}
                title={
                    <p className="font-size-18px m-b-0">
                        Chi tiết đơn hàng
                        {order && (
                            <>
                                <span style={{ color: '#4670FF' }}>{` #${order.orderCode}`}</span>
                                <b>{` - ${helpers.convertOrderStatus(order.orderStatus)}`}</b>
                            </>
                        )}
                    </p>
                }>
                <>
                    {isLoading ? (
                        <div className="pos-relative" style={{ minHeight: 180 }}>
                            <Spin
                                className="trans-center"
                                tip="Đang tải chi tiết đơn hàng..."
                                size="large"
                            />
                        </div>
                    ) : (
                        <Row gutter={[16, 16]}>
                            {/* thời gian đặt hàng */}
                            <Col span={24} className="time-order ">
                                <b className="font-size-14px">
                                    {`Ngày đặt hàng  ${helpers.formatOrderDate(
                                        order.orderDate,
                                        1,
                                    )}`}
                                </b>
                            </Col>

                            {/* địa chỉ người nhận */}
                            <Col span={12}>
                                <h3 className="t-center m-b-12">ĐỊA CHỈ NGƯỜI NHẬN</h3>
                                <div
                                    className="content-order"
                                    style={{ minHeight: 150 }}>
                                    <h3 className="m-b-8">
                                        <b>{order.deliveryAddressesOrder.nameReceiver}</b>
                                    </h3>
                                    <p className="m-b-8">{`Địa chỉ: ${order.deliveryAddressesOrder.shippingAddress}`}</p>
                                    <p className="m-b-8">
                                        Số điện thoại: {order.deliveryAddressesOrder.phoneReceiver}
                                    </p>
                                </div>
                            </Col>

                            {/* Ghi chú */}
                            <Col span={12}>
                                <h3 className="t-center m-b-12">GHI CHÚ</h3>
                                <div
                                    className="content-order"
                                    style={{ minHeight: 150 }}>
                                    <b>{order.note}</b>
                                </div>
                            </Col>

                            {/* Hình thức thanh toán */}
                            <Col span={12}>
                                <h3 className="t-center m-b-12">HÌNH THỨC THANH TOÁN</h3>
                                <div
                                    className="content-order"
                                    style={{ minHeight: 150 }}>
                                    <p className="m-b-8">
                                        {/* {helpers.convertPaymentMethod(order.paymentMethod)} */}
                                        Phương thức thanh toán: {order.paymentDetail.paymentMethod}
                                    </p>
                                    <p className='m-b-8'>
                                        Mã thanh toán: {order.paymentDetail.idCodeMethod}
                                    </p>
                                </div>
                            </Col>


                            {/* trạng thái thanh toán */}
                            <Col span={12}>
                                <h3 className="t-center m-b-12">TRẠNG THÁI THANH TOÁN</h3>
                                <div
                                    className="content-order"
                                    style={{ minHeight: 150 }}>
                                    <p className="m-b-8">
                                        {order.paymentDetail.paymentStatus}
                                    </p>
                                </div>
                            </Col>
                            {/* Chi tiết sản phẩm đã mua */}
                            <Col span={24}>
                                <Table
                                    pagination={false}
                                    columns={columns}
                                    dataSource={[{ key: 1, ...order }]}
                                />
                            </Col>

                            {/* Tổng cộng */}
                            <Col span={24} className="pice">
                                <div className="van-chuyen">
                                    <p style={{ color: '#bbb' }}>Phí vận chuyển</p>
                                    <span
                                        className="conten-vt"
                                        style={{ color: '#888', minWidth: 180 }}>
                                        {helpers.formatProductPrice(order.deliveryAddressesOrder.transportFee)}
                                    </span>
                                </div>
                                <div className="van-chuyen">
                                    <p style={{ color: '#bbb' }}>Tổng cộng</p>
                                    <span
                                        className="content-tong"
                                        style={{ color: '#ff2000', minWidth: 180 }}>
                                        {helpers.formatProductPrice(order.paymentDetail.paidAmount)}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    )}
                </>
            </Modal>
        );
    }
}

OrderDetail.propTypes = {
    orderId: PropTypes.string,
    onClose: PropTypes.func,
};

export default OrderDetail;
