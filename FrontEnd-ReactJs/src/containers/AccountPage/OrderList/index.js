import React, { Component } from 'react';
import { Button, Spin, Table } from 'antd';
import { getListOrderApi } from '../../../services/orderService.js';
import { connect } from 'react-redux';
import helpers from '../../../helpers/index.js';
import OrderDetail from './OrderDetail/index.js';

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            orderList: [],
            orderDetails: {
                isOpen: false,
                orderId: '',
            },
            updateModalVisible: false,
            selectedOrderId: '',
            selectedOrderStatus: '',
        };
    }

    // fn: Hàm  khởi tạo đầu tiên 
    componentDidMount() {
        this.getOrderList();
    }

    // fn: Gọi api lấy list order của user
    async getOrderList() {
        try {
            this.setState({ isLoading: true });
            const user = this.props.user;
            const response = await getListOrderApi(user.id_account);
            if (response) {
                const list = response.data;
                this.setState({
                    orderList: list.map((item, index) => {
                        return { ...item, key: index };
                    }),
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            this.setState({ isLoading: false, orderList: [] });
        }
    }

    // fn: Render
    render() {
        const { isLoading, orderList, orderDetails } = this.state;
        const orderColumns = [
            {
                title: 'Mã đơn hàng',
                dataIndex: 'orderCode',
                key: 'orderCode',
                render: (orderCode, record) => (
                    <Button
                        type="link"
                        onClick={() =>
                            this.setState({
                                orderDetails: {
                                    isOpen: true,
                                    orderId: record.id
                                }
                            })
                        }
                    >
                        <b>{orderCode}</b>
                    </Button>
                ),
            }, // mã đơn hàng 
            {
                title: 'Ngày mua',
                dataIndex: 'orderDate',
                key: 'orderDate',
                render: (orderDate) => helpers.formatOrderDate(orderDate),
                sorter: (a, b) => {
                    if (a.orderDate < b.orderDate) return -1;
                    if (a.orderDate > b.orderDate) return 1;
                    return 0;
                },
            }, // ngày mua
            {
                title: 'Tổng tiền',
                dataIndex: 'paidAmount',
                key: 'paidAmount',
                render: (paidAmount) => (
                    <b>{helpers.formatProductPrice(paidAmount)}</b>
                ),
            },// tổng tiền
            {
                title: 'Trạng thái đơn hàng',
                dataIndex: 'orderStatusDetail',
                key: 'orderStatusDetail',
                render: (orderStatusDetail) => <b>{orderStatusDetail}</b>
            },// trạng thái đơn hàng
        ];

        return (
            <>
                {isLoading ? (
                    <div className="t-center m-tb-48">
                        <Spin
                            tip="Đang tải danh sách đơn hàng của bạn ..."
                            size="large"
                        />
                    </div>
                ) : (
                    <>
                        {orderList && orderList.length === 0 ? (
                            <h3 className="m-t-16 t-center" style={{ color: '#888' }}>
                                Hiện tại bạn chưa có đơn hàng nào
                            </h3>
                        ) : (
                            <Table
                                columns={orderColumns}
                                dataSource={orderList}
                                pagination={{
                                    pageSize: 8,
                                    showSizeChanger: false,
                                    position: ['bottomRight'],
                                }}
                            />
                        )}
                    </>
                )}
                {orderDetails.isOpen && (
                    <OrderDetail
                        orderId={orderDetails.orderId}
                        onClose={() =>
                            this.setState({ orderDetails: { ...orderDetails, isOpen: false } })
                        }
                    />
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, null)(OrderList);
