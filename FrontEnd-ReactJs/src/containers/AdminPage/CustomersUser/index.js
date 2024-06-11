import React, { Component } from 'react';
import { Button, message, Popconfirm, Spin, Table } from 'antd';
import { getUserApi, delCustomerApi } from '../../../services/adminService';
import { exportToExcel } from '../../../utils/exportFile';
import './index.scss'

class CustomerUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
        };
    }

    // fn: các cột của bảng
    columns = [
        {
            title: 'ID',
            key: 'id_account',
            dataIndex: 'id_account',
            render: (v) => <span>{v}</span>,
        }, // ID tài khoản
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
        }, // Email
        {
            title: 'Loại tài khoản',
            key: 'authType',
            dataIndex: 'authType',
            render: (v) => <span>{v}</span>,
        }, // Loại tài khoản
        {
            title: 'Họ tên',
            key: 'fullName',
            dataIndex: 'fullName',
        }, // Họ tên
        {
            title: 'Quê quán',
            key: 'address',
            dataIndex: 'address',
        }, // Quên quán
        {
            title: 'Ngày sinh',
            key: 'birthDay',
            dataIndex: 'birthDay',
        }, // ngày sinh 
        {
            title: 'Giới tính',
            key: 'gender',
            dataIndex: 'gender',
        }, // Giới tính
        {
            title: '',
            render: (_v, records) => (
                <Popconfirm
                    title="Bạn có chắc muốn xoá ?"
                    placement="left"
                    cancelText="Huỷ bỏ"
                    okText="Xoá"
                    onConfirm={() => this.onDelCustomer(records.id_account)}>
                    <Button danger>Xoá</Button>
                </Popconfirm>
            ),
        }, // tác vụ
    ];

    // fn: gọi api lấy danh sách user
    getCustomerList = async () => {
        try {
            this.setState({ isLoading: true });

            // Gọi API hoặc service để lấy danh sách người dùng
            const response = await getUserApi();

            // Cập nhật state nếu lấy dữ liệu thành công
            if (response && response.data && response.code === 0) {
                const userList = response.data;
                const newList = userList.map((item) => {
                    return {
                        key: item.id_account,
                        id_account: item.id_account,
                        email: item.email,
                        emailId: item.emailId,
                        authType: item.authType,
                        fullName: item.fullName,
                        address: item.address,
                        birthDay: item.birthDay,
                        gender: item.gender,
                    };
                });
                this.setState({ data: newList, isLoading: false });
            } else {
                message.error('Lấy danh sách người dùng thất bại');
                this.setState({ isLoading: false });
            }
        } catch (error) {
            message.error('Lấy danh sách người dùng thất bại');
            this.setState({ isLoading: false });
        }
    };

    // fn: Xoá người dùng
    onDelCustomer = async (id) => {
        try {
            // Gọi API hoặc service để xoá người dùng theo ID
            const response = await delCustomerApi(id);

            // Cập nhật UI nếu xoá thành công
            if (response && response.code === 0) {
                message.success('Xoá tài khoản thành công');
                this.setState({
                    data: this.state.data.filter((item) => item.id_account !== id),
                });
            } else {
                message.error('Xoá tài khoản thất bại');
            }
        } catch (error) {
            message.error('Xoá tài khoản thất bại');
        }
    };

    // fn: Hàm chạy đầu tiên khi vào 
    componentDidMount() {
        this.getCustomerList();
    }

    // fn: Xuất dữ liệu ra file excel
    exportToExcel = async () => {
        try {
            const response = await getUserApi();
            if (response && response.data && response.code === 0) {
                const userList = response.data;
                if (userList && userList.length > 0) {
                    const newList = userList.map((item) => {
                        return {
                            key: item.id_account,
                            id_account: item.id_account,
                            email: item.email,
                            emailId: item.emailId,
                            authType: item.authType,
                            fullName: item.fullName,
                            address: item.address,
                            birthDay: item.birthDay,
                            gender: item.gender,
                        };
                    });
                    const data = newList;
                    await exportToExcel(data, "Danh sách người dùng", "ListCustomers");
                }
                else {
                    message.error('Không có người dùng để xuất file');
                }
            }
            else {
                message.error('Lấy danh sách người dùng thất bại');
            }
        }
        catch (error) {
            message.error('Lấy danh sách người dùng thất bại');
            this.setState({ isLoading: false });
        }
    }

    // fn: render
    render() {
        return (
            <>
                <div className='excel'>
                    <Button
                        type="primary"
                        className='button-excel'
                        onClick={this.exportToExcel}
                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                    >
                        Xuất Excel
                    </Button>
                </div>
                <>
                    {this.state.isLoading ? (
                        <Spin className="trans-center" tip="Đang lấy danh sách ..." />
                    ) : (
                        <Table
                            columns={this.columns}
                            dataSource={this.state.data}
                            pagination={{ showLessItems: true, position: ['bottomCenter'] }}
                        />
                    )}
                </>
            </>

        );
    }
}

export default CustomerUser;
