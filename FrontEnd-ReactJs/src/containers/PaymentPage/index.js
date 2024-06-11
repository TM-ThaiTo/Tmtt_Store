import React, { Component } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Input, message, Radio, Result, Row, Modal } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDeliveryAddress } from '../../services/addressService.js';
import { postCreateOrder } from '../../services/orderService.js';
import CartPayment from '../../components/Carts/Payment';
import constants from '../../constants';
import AddressUserList from '../AccountPage/UserAddressList/index.js';
import helpers from '../../helpers';
import cartAction from '../../store/actions/cartActions.js';
import moment from 'moment';
import './index.scss';

class PaymentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carts: [],
            note: '',
            totalAmount: 0,
            paidAmount: 0,
            transportFee: 0,
            addressIndex: -1,
            transport: 0,
            transportString: '',
            isLoading: false,
            isOrderSuccess: false,
            length: 200,
            // handle chon address
            isAddress: false,

            // ID thanh toán Vnpay của order
            vnp_TxnRef: 0,

            // Không lưu được trong .env nên lưu tạm ở đây
            VNP_TMNCODE: 'TEJU6Y5Q',
            VNP_HASHSECRET: 'EWROMBQUCSOIGEWNKTRZIIPBNPUZMNEK',
            VNP_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            VNP_RETURNURL: 'http://localhost:4000/cart'
            // VNP_TMNCODE: process.env.VNP_TMNCODE,
            // VNP_HASHSECRET: process.env.VNP_HASHSECRET,
            // VNP_URL: process.env.VNP_URL,
            // VNP_RETURNURL: process.env.VNP_RETURNURL,

        };
        this.onCheckout = this.onCheckout.bind(this);
    }

    // fn: render lần đầu tiên
    componentDidMount() {
    }

    // fn: render liên tục khi có sự thay đổi 
    componentDidUpdate(prevProps) {
        if (prevProps.transport !== this.props.transport) {
            this.calculatePrice(this.props.carts);
        }
    }

    //#region Đặt hàng thông thường
    // fn: hàm tính toán và cập nhật state
    calculatePrice = async (carts) => {
        // giá gốc
        const tamTinh = carts.reduce(
            (a, b) => a + (b.price) * b.amount, 0
        );
        const totalAmount = tamTinh + this.calculateTransportFee();
        const giamGia = carts.reduce(
            (a, b) => a + ((b.price * b.discount) / 100) * b.amount,
            0,
        );
        const paidAmount = totalAmount - giamGia;
        this.setState({
            totalAmount: totalAmount,
            paidAmount: paidAmount,
        });
    }

    // fn: tính toán phí vận chuyển
    calculateTransportFee() {
        const { carts } = this.props;
        const tempPrice = carts.reduce(
            (a, b) => a + (b.price + (b.price * b.discount) / 100) * b.amount,
            0,
        );

        // Tính phí vận chuyển dựa trên tổng giá trị của đơn hàng
        const transportFee = tempPrice >= 1000000
            ? 0
            : constants.TRANSPORT_METHOD_OPTIONS.find(
                (item) => item.value === this.state.transport
            ).price;
        // Trả về giá trị transportFee
        return transportFee;
    }

    // fn: Lấy danh sách địa chỉ nhận hàng của user
    async getUserDeliveryAdd(userId, index = 0) {
        try {
            const response = await getDeliveryAddress(userId, 1);
            if (response.code === 0) {
                return response.data.list[index];
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    // fn: hiển thị thông tin giỏ hàng
    showOrderInfo(carts) {
        return carts.map((item, index) => (
            <Card key={index}>
                <Card.Meta
                    avatar={
                        <Avatar size={48} shape="square" src={item.avt} alt="Photo" />
                    }
                    title={helpers.reduceProductName(item.name, 40)}
                    description={
                        <>
                            <span>{`Số lượng: ${item.amount}`}</span>
                            <p className="font-size-16px font-weight-700">
                                {helpers.formatProductPrice(item.price)}
                            </p>
                        </>
                    }
                />
            </Card>
        ));
    }

    // fn: xác nhận đặt hàng
    onCheckout = async () => {
        const { carts, user } = this.props;
        await this.calculatePrice(carts);
        const { addressIndex, transportString, note } = this.state;
        try {
            this.setState({ isLoading: true });
            // lấy id người dùng theo redux user
            const owner = user.id_account;

            // xác nhận người dùng đã chọn địa chỉ giao hàng
            if (addressIndex === -1) {
                message.error('Vui lòng chọn địa chỉ giao hàng', 3);
                this.setState({ isLoading: false });
                return;
            }

            // gọi hàm lấy địa chỉ theo index người dùng chọn
            const deliveryAdd = await this.getUserDeliveryAdd(owner, addressIndex);

            // tạo các biến phương thức thanh toán, ...
            const transportMethod = transportString;

            // tạo Json deliveryAddressesOrder
            const deliveryAddressesOrder = {
                nameReceiver: deliveryAdd.name,
                phoneReceiver: deliveryAdd.phone,
                shippingAddress: deliveryAdd.address,
                shippingMethod: transportMethod,
                transportFee: this.calculateTransportFee().toString(),
            }

            // tạo Json paymentDetail thông tin thanh toán
            const paymentDetail = {
                paymentMethod: "Tiền mặt",
                paymentStatus: 'Chưa thanh toán',
                totalAmount: this.state.totalAmount,
                paidAmount: this.state.paidAmount,
            }

            // tạo thời gian đặt hàng
            const orderDate = new Date();

            // tạo người dùng đặt hàng => với tài khoản tạo order
            const customerOrder = {
                customerId: owner,
                customerName: user.fullName,
                customerEmail: user.email,
                customerPhone: deliveryAdd.phone,
                customerAddress: user.address,
            }

            // tổng số sản phẩm
            let numOfProd = 0;

            // list giỏ hàng
            const productList = carts.map((item, index) => {
                const { amount, name, price, discount, id_product } = item;
                numOfProd += amount;
                return {
                    stock: amount,
                    productId: id_product,
                    name: name,
                    price: price,
                    discount: discount,
                };
            });

            // gán vào detailOrderProduct
            const detailOderProducts = productList;

            // thêm thông tin đặt hàng
            const orderStatusDetail = "Đặt hàng";

            // data gửi api
            const data = {
                orderDate: orderDate,
                orderStatusDetail,
                numOfProd: numOfProd.toString(),
                note: note,
                customerOrder: customerOrder,
                detailOderProducts: detailOderProducts,
                deliveryAddressesOrder: deliveryAddressesOrder,
                paymentDetail: paymentDetail
            };

            const response = await postCreateOrder(data);
            if (response.code === 0) {
                message.success("Đặt hàng thành công", 2);
                this.props.resetCart();
                this.setState({
                    isLoading: false,
                    isOrderSuccess: true
                });
            }
            else {
                this.setState({ isLoading: false });
            }
        }
        catch (error) {
            message.error('Đặt hàng thất bại, thử lại', 3);
            this.setState({ isLoading: false });
        }
    }
    //#endregion

    //#region Xữ lý thanh toán VNPay
    // fn: Hàm lấy địa chỉ IP client 
    getClientIP = async () => {
        try {
            // Gửi yêu cầu GET đến ipify API
            const response = await fetch('https://api.ipify.org?format=json');
            // Chuyển đổi phản hồi sang dạng JSON
            const data = await response.json();
            // Trả về địa chỉ IP của client
            return data.ip;
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error fetching client IP address:', error);
            return null;
        }
    }
    //fn: hàm làm gọn object
    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
    // fn: gọi đến thanh toán VNpay
    // xử lý đường dẫn url thanh và chuyển hướng người dùng tới trang thanh toán
    // mặc định ngân hàng thanh toán là NCB
    redirectVNPAYPayment = async () => {
        try {
            const { carts } = this.props;
            await this.calculatePrice(carts);

            // Lấy địa chỉ IP của client
            let ipAddr = "";

            // Số tiền cần thanh toán, bạn cần thay thế bằng cách lấy số tiền từ state hoặc props của component
            let amount = this.state.paidAmount;

            // Sử dụng hàm để lấy địa chỉ IP của client
            // Lấy địa chỉ IP của client bất đồng bộ
            ipAddr = await this.getClientIP();
            if (!ipAddr) {
                console.error('Unable to retrieve client IP address.');
                return;
            }

            // Các thông tin cần thiết từ cổng thanh toán VNPAY
            const { VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURNURL } = this.state;
            let tmnCode = VNP_TMNCODE;
            let secretKey = VNP_HASHSECRET;
            let vnpUrl = VNP_URL;
            let returnUrl = VNP_RETURNURL;

            // múi giờ 
            process.env.TZ = 'Asia/Ho_Chi_Minh';

            // tạo ngày
            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');

            // tạo id Order
            let orderId = moment(date).format('DDHHmmss');

            // Mã ngân hàng, bạn cần xác định mã ngân hàng hoặc để trống nếu không cần thiết
            let bankCode = "NCB";

            // Thiết lập ngôn ngữ mặc định là 'vn'
            let locale = "vn";

            // Loại tiền tệ
            let currCode = 'VND';

            // soạn data gửi tới VNpay
            let vnp_Params = {
                'vnp_Version': '2.1.0',
                'vnp_Command': 'pay',
                'vnp_TmnCode': tmnCode,
                'vnp_Locale': locale,
                'vnp_CurrCode': currCode,
                'vnp_TxnRef': orderId,
                'vnp_OrderInfo': 'Thanh toan cho ma GD:' + orderId,
                'vnp_OrderType': 'other',
                'vnp_Amount': amount * 100,
                'vnp_ReturnUrl': returnUrl,
                'vnp_IpAddr': ipAddr,
                'vnp_CreateDate': createDate
            };

            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            // Sắp xếp các tham số theo thứ tự alphabet
            let sortedParams = this.sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(sortedParams, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;

            // Tạo URL thanh toán của VNPAY
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            this.setState({
                vnp_TxnRef: orderId,
            })

            // Chuyển hướng người dùng đến trang thanh toán của VNPAY
            setTimeout(() => {
                window.location.href = vnpUrl;
            }, 2000); // Thời gian đợi 2 giây (2000 milliseconds)
        } catch (error) {
            message.error('Error handling VNPAY payment:', 3);
            console.log("Check error: ", error);
            this.setState({ isLoading: false });
        }
    };

    // fn: hàm xữ lý thanh toán
    // khi khách hàng tạo đơn hàng => lưu tạm thông tin đơn hàng(với trạng thái chưa thanh toán và phương thức VNPay)
    // sau khi khách hàng thực hiện xong thanh toán thì chuyển hướng sang trang Cart để cập nhật lại đơn hàng
    handleVNPAYPayment = async () => {
        const { carts, user } = this.props;
        await this.calculatePrice(carts);
        const { addressIndex, transportString, note } = this.state;
        try {
            // xác nhận người dùng đã chọn địa chỉ giao hàng
            if (addressIndex === -1) {
                message.error('Vui lòng chọn địa chỉ giao hàng', 3);
                this.setState({ isLoading: false });
                return;
            }

            // Hiển thị modal hỏi người dùng xác nhận thanh toán
            Modal.confirm({
                title: 'Xác nhận thanh toán',
                content: 'Bạn có chắc chắn muốn thanh toán bằng VNPay không?',
                onOk: async () => {
                    this.setState({ isLoading: true });
                    await this.redirectVNPAYPayment();

                    const owner = user.id_account;
                    // xác nhận người dùng đã chọn địa chỉ giao hàng
                    if (addressIndex === -1) {
                        message.error('Vui lòng chọn địa chỉ giao hàng', 3);
                        this.setState({ isLoading: false });
                        return;
                    }

                    // gọi hàm lấy địa chỉ theo index người dùng chọn
                    const deliveryAdd = await this.getUserDeliveryAdd(owner, addressIndex);

                    // tạo các biến phương thức thanh toán, ...
                    const transportMethod = transportString;

                    // tạo Json deliveryAddressesOrder
                    const deliveryAddressesOrder = {
                        nameReceiver: deliveryAdd.name,
                        phoneReceiver: deliveryAdd.phone,
                        shippingAddress: deliveryAdd.address,
                        shippingMethod: transportMethod,
                        transportFee: this.calculateTransportFee().toString(),
                    }

                    // tạo Json paymentDetail
                    const paymentDetail = {
                        paymentMethod: 'VNPay',
                        paymentStatus: 'Chưa thanh toán',
                        idCodeMethod: this.state.vnp_TxnRef,
                        totalAmount: this.state.totalAmount,
                        paidAmount: this.state.paidAmount,
                    }

                    // tạo thời gian đặt hàng
                    const orderDate = new Date();

                    // tạo người dùng => với tài khoản tạo order
                    const customerOrder = {
                        customerId: owner,
                        customerName: user.fullName,
                        customerEmail: user.email,
                        customerPhone: deliveryAdd.phone,
                        customerAddress: user.address,
                    }

                    // tổng số sản phẩm
                    let numOfProd = 0;

                    // list giỏ hàng
                    const productList = carts.map((item, index) => {
                        const { amount, name, price, discount, id_product } = item;
                        numOfProd += amount;
                        return {
                            stock: amount,
                            productId: id_product,
                            name: name,
                            price: price,
                            discount: discount,
                        };
                    });

                    // gán vào detailOrderProduct
                    const detailOderProducts = productList;

                    // thêm thông tin đặt hàng
                    const orderStatusDetail = "Đặt hàng";

                    // data gửi api
                    const data = {
                        orderDate: orderDate,
                        orderStatusDetail,
                        numOfProd: numOfProd.toString(),
                        note: note,
                        customerOrder: customerOrder,
                        detailOderProducts: detailOderProducts,
                        deliveryAddressesOrder: deliveryAddressesOrder,
                        paymentDetail: paymentDetail
                    };

                    const response = await postCreateOrder(data);
                    if (response.code === 0) {
                        this.setState({
                            isLoading: false,
                        });
                    }
                    else {
                        this.setState({ isLoading: false });
                    }
                },
                onCancel: () => {
                    // console.log('Hủy thanh toán');
                    message.error("Đã huỷ thanh toán", 3);
                },
            });
        } catch (error) {
            message.error("Lỗi thanh toán VNPay", 3);
        }
    }
    //#endregion

    // fn: render
    render() {
        const { carts, isAuth } = this.props;
        // const { isLoading, isOrderSuccess } = this.state;
        const { isLoading, isOrderSuccess, length } = this.state;

        if (isOrderSuccess) {
            return <Redirect to="/" />;
        }

        // kiểm tra xem đã có hàng trong giỏ hàng chưa
        if (carts.length <= 0 && !isOrderSuccess) {
            return <Redirect to={constants.ROUTES.CART} />;
        }

        // kiểm tra người dùng đăng nhập chưa?
        if (!isAuth) {
            return <Redirect to={constants.ROUTES.LOGIN} />;
        }

        return (
            <>
                {isOrderSuccess ? (
                    <Result
                        status="success"
                        title="Đơn hàng của bạn đã đặt thành công."
                        subTitle="Xem chi tiết đơn hàng vừa rồi"
                        extra={[
                            <Button type="default" key="0">
                                <Link to={constants.ROUTES.ACCOUNT + '/orders'}>
                                    Xem chi tiết đơn hàng
                                </Link>
                            </Button>,
                            <Button key="1" type="primary">
                                <Link to="/">Tiếp tục mua sắm</Link>
                            </Button>,
                        ]}
                    />
                ) : (
                    <div className='container payment-page'>
                        <Row gutter={[16, 16]}>
                            {/* Đường dẫn */}
                            <Col span={24} className="duong-dan">
                                <Link to="/">
                                    <HomeOutlined
                                        className="icon"
                                        style={{ borderRadius: 50 }}
                                    />
                                </Link>
                                <span
                                    className="icon-duong-dan"
                                    style={{ lineHeight: '40px' }}>{`>`}
                                </span>
                                <span
                                    className="name"
                                    style={{ borderRadius: 50 }}>
                                    Tiến hành thanh toán
                                </span>
                            </Col>

                            {/* Thông tin giao hàng  */}
                            <Col span={24} md={16}>
                                {/* địa chỉ giao nhận, cách thức giao */}
                                <div className="thong-tin-giao-hang">
                                    <h2>Thông tin giao hàng</h2>
                                    <Radio.Group
                                        defaultValue={this.state.transport}
                                        onChange={(v) => this.setState({
                                            transport: v.target.value,
                                        })}
                                        className="m-tb-8">
                                        {constants.TRANSPORT_METHOD_OPTIONS.map((item, index) => (
                                            <Radio key={index} value={item.value}>
                                                {item.label}
                                            </Radio>
                                        ))}
                                    </Radio.Group>

                                    {/* List địa chỉ nhận hàng */}
                                    <AddressUserList
                                        isCheckout={true}
                                        onChecked={(value) => (this.setState({ addressIndex: value }))}
                                    />
                                </div>

                                {/* ghi chú */}
                                <div className="thong-tin-ghi-chu">
                                    <h2 className="m-b-8">Ghi chú cho đơn hàng</h2>
                                    <Input.TextArea
                                        placeholder="Nhập thông tin ghi chú nhà bán"
                                        maxLength={length}
                                        showCount
                                        allowClear
                                        onChange={(value) => (this.setState({ note: value.target.value }))}
                                    />
                                </div>

                                {/* phương thức thanh toán */}
                                <div className="thong-tin-thanh-toan">
                                    <h2 className="m-b-8">Phương thức thanh toán</h2>
                                    <p>Thông tin thanh toán của bạn sẽ luôn được bảo mật</p>
                                    <Row gutter={[16, 16]}>

                                        {/* Tiền mặt */}
                                        <Col
                                            span={24}
                                            md={12}
                                        >
                                            <div className="thanh-toan-tien-mat item-active">
                                                <b className="font-size-16px">
                                                    Thanh toán khi nhận hàng
                                                </b>
                                                <p>
                                                    Thanh toán bằng tiền mặt khi nhận hàng tại nhà hoặc
                                                    showroom.
                                                </p>
                                            </div>
                                        </Col>

                                        {/* Vnpay */}
                                        <Col
                                            span={24}
                                            md={12}
                                            onClick={() => this.handleVNPAYPayment()}>
                                            <div className="thanh-toan-VNPAY">
                                                <b className="font-size-16px">
                                                    Thanh toán Online qua cổng VNPAY
                                                </b>
                                                <p>
                                                    Thanh toán qua Internet Banking, Visa, Master, JCB,
                                                    VNPAY-QR.
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                            {/* đặt hàng */}
                            <Col span={24} md={8}>
                                {/* thông tin đơn hàng */}
                                <div className="p-12 bg-white bor-rad-8 m-tb-16 thong-tin-don-hang">
                                    <div className="d-flex justify-content-between content-don-hang">
                                        <h2>Thông tin đơn hàng</h2>
                                        <Button type="link" size="large">
                                            <Link to={constants.ROUTES.CART}>Chỉnh sửa</Link>
                                        </Button>
                                    </div>
                                    <div>{this.showOrderInfo(carts)}</div>
                                </div>

                                {/* tiến hành đặt hàng */}
                                <div className="bg-white tien-hanh-dat-hang">
                                    {/* <ReCaptcha /> */}
                                    <CartPayment
                                        isLoading={isLoading}
                                        carts={carts}
                                        isCheckout={true}
                                        transportFee={this.calculateTransportFee()}
                                        onCheckout={this.onCheckout}
                                    />
                                    <div className="t-center p-b-16">
                                        <span
                                            style={{
                                                color: '#ff5000',
                                            }}>{`(Xin vui lòng kiểm tra lại đơn hàng trước khi đặt mua)`}</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </>
        );
    }
}

const mapStateToProps = state => ({
    carts: state.cart,
    isAuth: state.authenticate.isAuth,
    user: state.user,
});

const mapDispatchToProps = dispatch => {
    return {
        resetCart: () => dispatch(cartAction.resetCart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);

