import React, { Component } from 'react';
import { Button, message, Modal, Radio, Spin, Table, Input, Select } from 'antd';
import { getOrderListApi, postUpdateStatusOrderApi } from '../../../services/adminService.js';
import { exportToExcel } from '../../../utils/exportFile.js';
import { getSearchOrderApi } from '../../../services/orderService.js'
import helpers from '../../../helpers/index.js';
import constants from '../../../constants/index.js';
import OrderDetail from '../../AccountPage/OrderList/OrderDetail/index.js';
import VAT from './VAT/index.js';
import './index.scss'

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            orderDetails: {
                isOpen: false,
                orderId: '',
            },
            VATDetails: {
                isOpen: false,
                orderId: '',
            },
            updateModalVisible: false,
            selectedOrderId: '',
            selectedOrderStatus: '',

            valueInputCode: '',
            valueOrderStatus: '',
            valuePayment: '',
        };
    }
    //#region Hệ thống
    // event: lấy danh sách order
    componentDidMount() {
        this.getOrderList();
    }

    // fn: hàm lấy danh sách Order
    getOrderList = async () => {
        this.setState({ isLoading: true });
        try {
            const response = await getOrderListApi();
            if (response.code === 0) {
                const list = response.data;
                const newData = list.map((item, index) => ({
                    key: index,
                    owner: item.customerName,
                    orderCode: item.orderCode,
                    orderDate: helpers.formatOrderDate(item.orderDate),
                    totalMoney: item.paidAmount,
                    paymentMethod: item.paymentMethod,
                    orderStatus: item.paymentStatus,
                    orderStatusDetail: item.orderStatusDetail,
                    orderId: item.id,
                }));
                this.setState({ data: newData, isLoading: false });
            }
        } catch (error) {
            console.error('Error fetching order list:', error);
            this.setState({ isLoading: false });
        }
    }

    // fn: convect status
    generateFilterOrder() {
        let result = [];
        for (let i = 0; i < 7; ++i) {
            result.push({ value: i, text: helpers.convertOrderStatus(i) });
        }
        return result;
    }

    // fn: Xử lý khi người dùng nhấn đổi trạng thái đơn hàng
    handleUpdateOrderStatus = async () => {
        const { selectedOrderId, selectedOrderStatus } = this.state;
        const data = {
            idOrder: selectedOrderId,
            orderStatusDetail: selectedOrderStatus
        };
        try {
            const response = await postUpdateStatusOrderApi(data);
            if (response.code === 0) {
                message.success(response.message);
                this.setState({ updateModalVisible: false }); // Hide the modal
                this.getOrderList();
            } else {
                message.error(response.message);
                this.setState({ updateModalVisible: false }); // Hide the modal
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            message.error('Failed to update order status');
        }
    };
    //#endregion

    //#region xuất excel
    // fn: Xuất dữ liệu ra file excel
    exportToExcel = async () => {
        try {
            const response = await getOrderListApi();
            if (response.code === 0) {
                const list = response.data;
                if (list && list.length > 0) {
                    const newData = list.map((item, index) => ({
                        orderId: item.id,
                        key: index,
                        owner: item.customerName,
                        orderCode: item.orderCode,
                        orderDate: helpers.formatOrderDate(item.orderDate),
                        totalMoney: item.paidAmount,
                        paymentMethod: item.paymentMethod,
                        orderStatus: item.paymentStatus,
                        orderStatusDetail: item.orderStatusDetail,
                    }));
                    const ete = await exportToExcel(newData, "Danh sách đơn hàng", "ListOrders");
                    if (ete !== "ok") {
                        message.error("Lỗi xuất file Excel");
                    }
                } else {
                    message.error("Không có đơn hàng để xuất");
                }
            } else {
                message.error('Lấy danh sách đơn hàng thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng: ', error);
        }
    }
    //#endregion

    //#region Tìm kiếm đơn hàng
    // fn: Hàm change trạng thái đơn hàng
    handleChageStatusOrder = (value) => {
        const statusOrder = constants.ORDER_STATUS.find(item => item.type === value);
        if (statusOrder) {
            this.setState({
                valueOrderStatus: statusOrder.label,
            });
        }
    }

    // fn: Hàm change hình thức thanh toán
    handleChangePayment = (value) => {
        const paymentOrder = constants.PAYMENTS.find(item => item.type === value);
        if (paymentOrder) {
            this.setState({
                valuePayment: paymentOrder.label,
            });
        }
    }

    // fn: Hàm cập nhật input mã đơn hàng
    handleInputChangCodeOrder = (e) => {
        this.setState({
            valueInputCode: e.target.value,
        });
    };

    // fn: Hàm làm mới tìm kiếm
    handleResetSearch = () => {
        this.setState({
            valueInputCode: '',
            valueOrderStatus: '',
            valuePayment: '',
        });
        this.getOrderList();
    }

    // fn: Hàm xác nhận tìm kiếm
    handleSumitSearch = async () => {
        const { valueInputCode, valueOrderStatus, valuePayment } = this.state;
        if (!valueInputCode && !valueOrderStatus && !valuePayment) return;
        this.setState({ isLoading: true });
        try {
            const response = await getSearchOrderApi(valueInputCode, valueOrderStatus, valuePayment);
            if (response && response.code === 0) {
                const list = response.data;
                const newData = list.map((item, index) => ({
                    key: index,
                    owner: item.customerName,
                    orderCode: item.orderCode,
                    orderDate: helpers.formatOrderDate(item.orderDate),
                    totalMoney: item.paidAmount,
                    paymentMethod: item.paymentMethod,
                    orderStatus: item.paymentStatus,
                    orderStatusDetail: item.orderStatusDetail,
                    orderId: item.id,
                }));
                this.setState({ data: newData, isLoading: false });
            }
            else {
                message.error(response.message);
                this.setState({ isLoading: false });
            }
        }
        catch (error) {
            message.error("Lỗi tìm kiếm");
            console.error("Lỗi: ", error);
            this.setState({ isLoading: false });
        }

    }
    //#endregion

    // fn: render
    render() {
        const { data, isLoading, orderDetails, updateModalVisible, selectedOrderStatus, VATDetails } = this.state;
        const columns = [
            {
                title: 'Khách hàng',
                key: 'owner',
                dataIndex: 'owner',
                render: (v) => <span>{v}</span>
            }, // khách hàng
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
                                    orderId: record.orderId
                                }
                            })
                        }
                    >
                        <b>{orderCode}</b>
                    </Button>
                ),
            }, // mã đơn hàng
            {
                title: 'Ngày đặt',
                key: 'orderDate',
                dataIndex: 'orderDate',
                sorter: (a, b) => {
                    if (a.orderDate > b.orderDate) return 1;
                    if (a.orderDate < b.orderDate) return -1;
                    return 0;
                },
            }, // ngày đặt
            {
                title: 'Tổng tiền',
                key: 'totalMoney',
                dataIndex: 'totalMoney',
                render: (value) => (
                    <b style={{ color: '#333' }}>{helpers.formatProductPrice(value)}</b>
                ),
                sorter: (a, b) => a.totalMoney - b.totalMoney,
            }, // tổng tiền
            {
                title: 'HT thanh toán',
                key: 'paymentMethod',
                dataIndex: 'paymentMethod',
                render: (v) => <span>{v}</span>,
            },// hình thức thanh toán
            {
                title: "TT thanh toán",
                key: 'orderStatus',
                dataIndex: 'orderStatus',
                render: (v) => <span>{v}</span>,
            }, // trạng thái thanh toán
            {
                title: 'Trạng thái đơn hàng',
                key: 'orderStatusDetail',
                dataIndex: 'orderStatusDetail',
                render: (v) => <span>{v}</span>,
            }, // trang thái đơn hàng
            {
                title: 'Chức năng',
                className: 'chucnang',
                render: (_v, record) => (
                    <>
                        <Button
                            type="dashed"
                            className='btn-cn'
                            onClick={() => this.setState({ updateModalVisible: true, selectedOrderId: record.orderId })}
                        >
                            Cập nhật
                        </Button>
                        {/* 
                        <Button
                            type="primary"
                            className='btn-cn'
                            onClick={() => this.setState({
                                VATDetails: {
                                    isOpen: true,
                                    orderId: record.orderId
                                }
                            })}
                        >
                            Xuất VAT
                        </Button>
                        <Button
                            type="primary"
                            className='btn-cn'
                            style={{ backgroundColor: 'red', borderColor: 'red' }}
                        >
                            Xoá
                        </Button>
                         */}
                    </>
                ),
            }, // chức năng
        ];
        return (
            <>
                {/* Chức năng */}
                <div className='excel container'>
                    <div className='chucnang-timkiem-order'>
                        {/* nhập mã đơn hàng */}
                        <div className='input-order ma'>
                            <Input
                                className='he'
                                placeholder='Nhập mã đơn hàng'
                                onChange={this.handleInputChangCodeOrder}
                            >
                            </Input>
                        </div>

                        {/* hình thức thanh toán */}
                        <div className='select-trangthai ma'>
                            <Select
                                placeholder="Hình thức thanh toán"
                                style={{ width: '200px' }}
                                size="large"
                                onChange={this.handleChangePayment}
                            >
                                {constants.PAYMENTS.map((item, index) => (
                                    <Select.Option value={item.type} key={index}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {/* trạng thái đơn hàng  */}
                        <div className='select-trangthai ma'>
                            <Select
                                placeholder='Trạng thái đơn hàng'
                                size="large"
                                style={{ width: '200px' }}
                                dropdownStyle={{ width: '200px' }}
                                onChange={this.handleChageStatusOrder}
                            >
                                {constants.ORDER_STATUS.map((item, index) => (
                                    <Select.Option value={item.type} key={index}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {/* btn Tìm kiếm */}
                        <Button
                            type="primary"
                            className='he ma'
                            onClick={this.handleSumitSearch}
                        >
                            Tìm kiếm
                        </Button>

                        {/* btn làm mới */}
                        <Button
                            className='he ma'
                            style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black' }}
                            onClick={this.handleResetSearch}
                        >
                            Làm mới
                        </Button>
                    </div>

                    {/* button xuất file excel */}
                    <Button
                        type="primary"
                        className='button-excel he ma'
                        onClick={this.exportToExcel}
                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                    >
                        Xuất Excel
                    </Button>
                </div>

                {/* giao diện */}
                <>
                    {isLoading ? (
                        <Spin className="trans-center" tip="Đang lấy danh sách đơn hàng ..." />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{ showLessItems: true, position: ['bottomCenter'] }}
                        />
                    )}

                    {/* chi tiết đơn hàng */}
                    {orderDetails.isOpen && (
                        <OrderDetail
                            orderId={orderDetails.orderId}
                            onClose={() => this.setState({ orderDetails: { ...orderDetails, isOpen: false } })}
                        />
                    )}

                    {/* Tạo hoá đơn VAT */}
                    {VATDetails.isOpen && (
                        <VAT
                            orderId={VATDetails.orderId}
                            onClose={() => this.state({ VATDetails: { ...VATDetails, isOpen: false } })}
                        />
                    )}

                    {/* Modal for updating order status */}
                    <Modal
                        title="Cập nhật trạng thái đơn hàng"
                        visible={updateModalVisible}
                        onCancel={() => this.setState({ updateModalVisible: false })}
                        footer={[
                            <Button key="cancel" onClick={() => this.setState({ updateModalVisible: false })}>
                                Hủy
                            </Button>,
                            <Button key="submit" type="primary" onClick={this.handleUpdateOrderStatus}>
                                Cập nhật
                            </Button>,
                        ]}
                    >
                        <Radio.Group
                            value={selectedOrderStatus}
                            onChange={e => this.setState({ selectedOrderStatus: e.target.value })}
                        >
                            <Radio value={"Đã tiếp nhận"}>Đã tiếp nhận</Radio>
                            <Radio value={"Đóng gói xong"}>Đóng gói xong</Radio>
                            <Radio value={"Đang vận chuyển"}>Đang vận chuyển</Radio>
                            <Radio value={"Giao hàng thành công"}>Giao hàng thành công</Radio>
                            <Radio value={"Đã huỷ"}>Huỷ đơn</Radio>
                        </Radio.Group>
                    </Modal>
                </>
            </>
        );
    }
}

export default OrderList;
