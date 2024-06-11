import { HomeOutlined, MessageOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';

class NotFound extends Component {

    render() {
        return (
            <Result
                style={{ minHeight: '85vh' }}
                status="404"
                title="404 - Không tìm thấy trang"
                subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
                extra={
                    <>
                        <a href="https://www.facebook.com/to.trinh.520900/" target="blank">
                            <Button type="dashed" size="large">
                                <MessageOutlined /> Liên hệ tư vấn
                            </Button>
                        </a>
                        <Link to="/">
                            <Button type="primary" size="large">
                                <HomeOutlined /> Về trang chủ
                            </Button>
                        </Link>
                    </>
                }
            />
        );
    }
}

export default (NotFound);