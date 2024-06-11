import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, message, Modal, Row, Select } from 'antd';
import { postNewDeliveryAddress, getProvince, getDistrict, getCommune } from '../../../../services/addressService.js'
import PropTypes from 'prop-types';
import './index.scss'

class AddressAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
            provinceList: [],
            districtList: [],
            wardList: [],
            streetList: [],
            user: this.props.user,

            isLoading: false,

            isProvince: false,
            listProvince: [],
            idProvince: '',
            nameProvince: '',

            isDistrict: false,
            listDistrict: [],
            idDistrict: '',
            nameDistrict: '',

            isCommune: false,
            listCommune: [],
            idCommune: '',
            nameCommune: '',
        };
        this.provinceId = '';
        this.formRef = React.createRef();
    }

    // fn: Hàm khởi tạo đầu tiên
    componentDidMount = async () => {
        this.handleGetProvince();
    }

    // fn: Hàm lấy danh sách tỉnh
    handleGetProvince = async () => {
        this.setState({ isLoading: true });

        try {
            const response = await getProvince();
            if (response) {
                this.setState({
                    listProvince: response.data,
                    isLoading: false,
                })
            }
            else {
                message.error("Lỗi lấy địa chỉ");
                this.setState({ isLoading: false });
            }
        }
        catch (error) {
            message.error("Lỗi lấy địa chỉ");
            console.error("Lỗi api địa chỉ: ", error);
            this.setState({ isLoading: false });
        }
    }
    // event: Cập nhật giá trị tỉnh khi người dùng chọn tỉnh
    handleProvinceChange = async (value, option) => {
        const { name, value: id } = option.props;

        this.setState({
            isProvince: true,
            nameProvince: name,
            idProvince: id
        });
        await this.handleGetDistrict(id);
    };

    // fn: Hàm lấy danh sách huyện theo id tỉnh 
    handleGetDistrict = async (id) => {
        this.setState({ isLoading: true });
        try {
            const response = await getDistrict(id);
            if (response) {
                this.setState({
                    listDistrict: response.data,
                    isLoading: false,
                })
            }
            else {
                message.error("Lỗi lấy địa chỉ");
                this.setState({ isLoading: false });
            }
        }
        catch (error) {
            message.error("Lỗi lấy địa chỉ");
            console.error("Lỗi api địa chỉ: ", error);
            this.setState({ isLoading: false });
        }
    }
    // event: Cập nhật giá trị khi người dùng chọn huyện
    handleDistrictChange = async (value, option) => {
        const { name, value: id } = option.props;

        this.setState({
            isDistrict: true,
            nameDistrict: name,
            idDistrict: id
        });

        await this.handleGetCommune(id);
    }

    // fn: Hàm lấy danh sách phường theo id huyện
    handleGetCommune = async (id) => {
        this.setState({ isLoading: true });

        try {
            const response = await getCommune(id);
            if (response) {
                this.setState({
                    listCommune: response.data,
                    isLoading: false,
                })
            }
            else {
                message.error("Lỗi lấy địa chỉ");
                this.setState({ isLoading: false });
            }
        }
        catch (error) {
            message.error("Lỗi lấy địa chỉ");
            console.error("Lỗi api địa chỉ: ", error);
            this.setState({ isLoading: false });
        }
    }
    // event: cập nhật giá trị khi chọn phường
    handleCommuneChange = async (value, option) => {
        const { name, value: id } = option.props;

        this.setState({
            isCommune: true,
            nameCommune: name,
            idCommune: id
        });
    }

    // fn: sự kiện thêm địa chỉ
    onAddAddress = async (newAddress) => {
        const { user,
            isProvince, nameProvince,
            isDistrict, nameDistrict,
            isCommune, nameCommune
        } = this.state

        if (!isProvince || !isDistrict || !isCommune) {
            message.error("Vui lòng nhập đầy đủ thông tin địa chỉ");
            return;
        }
        try {
            const { name, phone, street, detail } = newAddress;
            const data = {
                userId: user.id_account,
                name: name,
                phone: phone,
                province: nameProvince,
                street: street,
                wards: nameCommune,
                district: nameDistrict,
                detail: detail
            }
            const response = await postNewDeliveryAddress(data);
            if (response && response.code === 0) {
                message.success('Thêm địa chỉ thành công', 2);
            }
            else {
                message.error(response.message, 3);
            }
        }
        catch (error) {
            if (error) {
                if (error.response) message.error(error.response.data.message, 2);
                else message.error('Thêm địa chỉ thất bại', 2);
            }
        }

        this.setState({ isVisible: false });
        this.props.onCloseForm(1);
    }

    // fn: rendering
    render() {
        const {
            isProvince, listProvince,
            isDistrict, listDistrict,
            listCommune,
        } = this.state

        return (
            <Modal
                visible={this.state.isVisible}
                closable={true}
                maskClosable={false}
                onCancel={() => {
                    this.setState({ isVisible: false });
                    this.props.onCloseForm();
                }}
                centered
                width={400}
                footer={[
                    <Button
                        key="back"
                        danger
                        onClick={() => {
                            this.setState({ isVisible: false });
                            this.props.onCloseForm();
                        }}>
                        Huỷ bỏ
                    </Button>,
                    <Button key="submit" type="primary" htmlType="submit" form="form"
                    // onClick={this.onAddAddress}
                    >
                        Thêm địa chỉ
                    </Button>,
                ]}>
                <div>
                    <h3>Thêm địa chỉ nhận hàng</h3>
                </div>

                <Form className='modal-form'
                    onFinish={this.onAddAddress}
                    ref={this.formRef}
                    name="form"
                >
                    <Row gutter={[32, 0]}>
                        <div className='content-modal'>
                            {/* người nhận */}
                            <div className='item'>
                                <Form.Item
                                    name="name"
                                    label="Người nhận"
                                    rules={[{ max: 255, message: 'Tối đa 255 ký tự' }]}
                                    className='custom-input'
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            {/* Số điện thoại */}
                            <div className='item'>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[{ max: 255, message: 'Tối đa 255 ký tự' }]}
                                    className='custom-input'
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            {/* danh sách tỉnh */}
                            <div className='item p-l-29px'>
                                <span>Tỉnh: </span>
                                <Select
                                    defaultValue="Chọn tỉnh thành"
                                    className='item-select p-l-33px'
                                    onChange={this.handleProvinceChange}
                                >
                                    {listProvince.map(province => (
                                        <Select.Option
                                            key={province.idProvince}
                                            value={province.idProvince}
                                            name={province.name}
                                        >
                                            {province.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            {/* danh sách huyện */}
                            <div className='item p-l-29px '>
                                <span>Huyện: </span>
                                <Select
                                    defaultValue="Chọn huyện"
                                    className='item-select-1 p-l-20px '
                                    onChange={this.handleDistrictChange}
                                    disabled={!isProvince}
                                >
                                    {listDistrict.map(district => (
                                        <Select.Option
                                            key={district.idDistrict}
                                            value={district.idDistrict}
                                            name={district.name}
                                        >
                                            {district.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            {/* danh sách phường */}
                            <div className='item p-l-24px'>
                                <span>Phường:</span>
                                <Select
                                    defaultValue="Chọn phường"
                                    className='item-select-1 p-l-19px'
                                    // style={{ width: 200 }}
                                    onChange={this.handleCommuneChange}
                                    disabled={!isDistrict}
                                >
                                    {listCommune.map(commune => (
                                        <Select.Option
                                            key={commune.idCommune}
                                            value={commune.idCommune}
                                            name={commune.name}
                                        >
                                            {commune.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            {/* đường */}
                            <div className='item p-l-10px'>
                                <Form.Item
                                    name="street"
                                    label="Đường"
                                    rules={[{ max: 255, message: 'Tối đa 255 ký tự' }]}
                                    className='input-duong'
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            {/* Ghi chú */}
                            <div className='item'>
                                <Form.Item
                                    name="detail"
                                    label="Ghi chú"
                                    className='custom-input'
                                >
                                    <Input style={{ maxWidth: '100%' }} />
                                </Form.Item>
                            </div>

                        </div>

                    </Row>
                </Form>

            </Modal>
        );
    }
}

AddressAddForm.propTypes = {
    onCloseForm: PropTypes.func,
    user: PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps)(AddressAddForm);
