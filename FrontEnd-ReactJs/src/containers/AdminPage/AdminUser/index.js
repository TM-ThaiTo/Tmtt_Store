import React, { Component } from 'react';
import { message, Spin, Table, Button } from 'antd';
import { getAllAdmin } from '../../../services/adminService';
import { exportToExcel } from '../../../utils/exportFile';

class AdminUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isLoading: true,
        };
    }

    // cột
    columns = [
        {
            title: 'User Name',
            key: 'userName',
            dataIndex: 'userName',
        },
        {
            title: 'Họ tên',
            key: 'fullName',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
        },
        {
            title: 'Quê quán',
            key: 'address',
            dataIndex: 'address',
        },
        {
            title: 'Tuổi',
            key: 'age',
            dataIndex: 'age',
        },
        {
            title: 'Số điện thoại',
            key: 'phone',
            dataIndex: 'phone',
        },
        {
            title: 'Facebook',
            key: 'fb',
            dataIndex: 'fb',
            render: (fb) => (
                <a href={fb} target="blank" rel="noopener noreferrer">
                    Link Facebook
                </a>
            ),
        },
    ];

    // event: Khởi tạo đầu tiên
    componentDidMount() {
        this.getUserAdminList();
    }

    // fn: Hàm lấy danh sách admin
    getUserAdminList = async () => {
        try {
            const response = await getAllAdmin();
            if (response && response.code === 0) {
                const list = response.data || [];
                const listWithKey = list.map((item, index) => ({ ...item, key: index }));
                this.setState({ data: listWithKey, isLoading: false });
            } else {
                message.error('Lấy danh sách Admin thất bại');
                this.setState({ isLoading: false });
            }
        } catch (error) {
            message.error('Lấy danh sách Admin thất bại');
            this.setState({ isLoading: false });
        }
    };

    // fn: Xuất dữ liệu ra file excel
    exportToExcel = async () => {
        try {
            // Gọi API hoặc service để lấy danh sách admin
            const response = await getAllAdmin();

            // Cập nhật state nếu lấy dữ liệu thành công
            if (response && response.data && response.code === 0) {
                const list = response.data || [];
                if (list && list.length > 0) {
                    const listWithKey = list.map((item, index) => ({ ...item, key: index }));
                    const data = listWithKey;
                    await exportToExcel(data, "Danh sách admin", "ListAdmins");
                }
                else {
                    message.error("Không có admin để xuất file");
                }
            }
            else {
                message.error('Lấy danh sách admin thất bại');
            }
        }
        catch (error) {
            message.error('Lấy danh sách admin thất bại');
        }
    }

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
                        <Table pagination={false} columns={this.columns} dataSource={this.state.data} />
                    )}
                </>
            </>
        )
    }
}

export default AdminUser;
