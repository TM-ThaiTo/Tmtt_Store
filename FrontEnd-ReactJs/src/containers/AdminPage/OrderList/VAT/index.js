import React, { Component } from "react";
import { Button, message } from "antd";
import { getDetailOrder } from "../../../../services/orderService";

class VAT extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            isLoading: true,
            data: [],
        };
    }

    // fn: Hàm khởi chạy đầu tiên
    componentDidMount() {
        this.getOrderDetails();
    }

    // fn: Hàm gọi api và lấy chi tiết order
    getOrderDetails = async () => {
        try {
            const { orderId } = this.props;
            const response = await getDetailOrder(orderId);
            if (response && response.code === 0) {
                this.setState({
                    data: response.data,
                    isLoading: false,
                });
            } else {
                message.error("Lỗi lấy chi tiết đơn hàng", 3);
                this.setState({ isLoading: false, data: null });
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            this.setState({ isLoading: false, data: null });
        }
    }

    // fn: hàm tạo data và xuất file
    handleExportFileVAT = () => {
        const { data } = this.state;
        console.log("Check data: ", data);
    }

    render() {
        return (
            <>
                <Button
                    onClick={this.handleExportFileVAT}
                >
                </Button>
            </>
        );
    }
}


export default VAT;