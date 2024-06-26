import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Footer.scss';

class Footer extends Component {
    render() {
        return (
            <div className=' footer'>
                <div className=' footer-lienhe'>
                    <div className='container footer-container'>
                        <div className='row footer-content'>
                            <div className='col-3 icon'>
                                <span>
                                    <i className="fas fa-phone"></i>
                                </span>
                            </div>
                            <div className='col-3 tuvan-muahang contact'>
                                <div>
                                    Liên hệ mua hàng
                                </div>
                                <div>
                                    0355341870
                                </div>
                            </div>
                            <div className='col-3 tuvan-quangcao contact'>
                                Liên hệ quảng cáo
                                <div>
                                    0355341870
                                </div>
                            </div>
                            <div className='col-3 hotro-kythuat contact'>
                                Liên hệ hỗ trợ
                                <div>
                                    0355341870
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container introduce'>
                    <div className='row noi-dung'>
                        <div className='logo-hutech'>

                        </div>
                        <div className='title-doAn'>
                            <div className='truong'>
                                Trường Đại Học Công Nghệ TP.HCM-HUTECH
                            </div>
                            <div className='gioithieumon'>
                                <span>Đồ án môn học: Lập trình ứng dụng với JAVA</span>
                            </div>
                            <div className='giangvien'>
                                <h3>Giảng viên: Ths. Nguyễn Huy Cường</h3>
                            </div>
                            <div className='detai'>
                                <span>Đề tài: Website bán máy tính và linh kiện máy tính</span>
                            </div>
                            <div className='nguoithuchien'>
                                <span>
                                    Trịnh Minh Thái Tố &nbsp; MSSV: 2180608122
                                </span>
                                <span>
                                    Tạ Tống Thành &nbsp;  MSSV: 2180608613
                                </span>
                                <span>
                                    Trình Minh Trí &nbsp;  MSSV: 2180608752
                                </span>
                                <span>
                                    Nguyễn Thị Hoàng Yến &nbsp;  MSSV: 2180603952
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

// map redux đến react
const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

