import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Input, message, Rate, Row, Progress } from 'antd';
import { Link } from 'react-router-dom';
import { postComment } from '../../../services/commentServices';
import PropTypes from 'prop-types';
import constants from '../../../constants';
import UserComment from './UserComment';
import './index.scss';

const { TextArea } = Input;

class EvaluationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cmtListState: props.cmtList,
            cmt: '',
            page: 1,
            isAuth: this.props.isAuth,
            user: this.props.user,
            star: 0,
        };
    }

    // event: cập nhật lại comment
    componentDidUpdate(prevProps) {
        if (prevProps.cmtList !== this.props.cmtList) {
            this.setState({ cmtListState: this.props.cmtList });
        }
    }

    // fn: Hàm thêm comment
    onComment = async () => {
        try {
            // const { avt, fullName } = this.state.user;
            const { fullName } = this.state.user;
            const content = this.state.cmt.trim();
            if (content === '' && this.state.star === 0) {
                message.warning('Hãy nhập nhận xét của bạn');
                return;
            }
            let data = {
                author: fullName,
                productId: this.props.productId,
                content,
                rate: this.state.star,
            };
            const response = await postComment(data);
            if (response && response.code === 0) {
                this.setState((prevState) => ({
                    cmtListState: [...prevState.cmtListState, data],
                    cmt: '',
                    star: 0,
                }));
                message.success("Thêm bình luận thành công", 1);
            }
        } catch (error) {
            message.error('Nhận xét thất bại. Thử lại', 3);
        }
    };

    render() {
        // const { rates, totalComment, ratesList, rateCounts } = this.props;
        // const { cmtListState, cmt, page, isAuth } = this.state;
        const { rates, totalComment, rateCounts } = this.props;
        const { cmtListState, cmt, isAuth } = this.state;
        // Tính trung bình số sao
        let starAvg;
        if (rates === null) {
            starAvg = 5;
        } else {
            starAvg = rates.toFixed(1);
        }
        const rateTotals = totalComment;
        return (
            <Row className="Evaluation-View bg-white p-16" style={{ borderRadius: 8 }}>
                {/* tiều đề */}
                <Col span={24}>
                    <h2 className="font-weight-700">Nhận xét của khách hàng</h2>
                    <div className="underline-title"></div>
                </Col>

                {/* đánh giá tổng quan */}
                <Col span={24} className="tongquan">
                    <span className="danhgia">Đánh giá</span>
                    <div className="overview noidung">

                        {/* tổng kết */}
                        <div className="tongket overview--total">
                            <h2 className="font-size-32px">{starAvg}</h2>
                            <Rate disabled defaultValue={starAvg} allowHalf style={{ fontSize: 12 }} />
                            <p className="nhanxet">{rateTotals} nhận xét</p>
                        </div>

                        {/* chi tiết */}
                        <div className="overview--detail chitiet flex-grow-1">
                            {rateCounts.map((item, index) => (
                                <div key={index} className="item-chitiet">
                                    <Rate
                                        disabled
                                        defaultValue={index}
                                        className='rate-chitiet'
                                    />
                                    <Progress
                                        percent={(item / rateTotals) * 100}
                                        type="line"
                                        showInfo={false}
                                        style={{ width: 172 }}
                                    />
                                    <span className="rate-name">{item}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </Col>

                {/* Xem bình luận, nhận xét */}
                <Col span={24}>
                    {cmtListState.map((item, index) => (
                        <UserComment key={index} comment={item} />
                    ))}
                    {/* {pageTotal > 1 && (
                        <Pagination
                            className="t-right m-b-16"
                            defaultCurrent={1}
                            total={pageTotal}
                            pageSize={1}
                            onChange={(p) => this.setState({ page: p })}
                        />
                    )} */}
                </Col>

                {/* bình luận */}
                <Col span={24} className="comment">
                    {isAuth ? (
                        <>
                            <TextArea
                                maxLength={constants.MAX_LEN_COMMENT}
                                autoSize
                                showCount
                                allowClear
                                value={cmt}
                                id="commentArea"
                                placeholder="Nhập nhận xét của bạn"
                                size="large"
                                className="text"
                                onChange={(e) => this.setState({ cmt: e.target.value })}
                            />
                            <div className='rate-button'>
                                <Rate
                                    allowClear
                                    className="rate"
                                    onChange={(e) => this.setState({ star: e })}
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    // style={{ flexBasis: 122 }}
                                    className='button-comment-f '
                                    onClick={this.onComment}
                                >
                                    Gửi nhận xét
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Button type="link" size="large">
                            <Link to={constants.ROUTES.LOGIN}>Đăng nhập để nhận xét</Link>
                        </Button>
                    )}
                </Col>
            </Row >
        );
    }
}

EvaluationView.defaultProps = {
    rates: [0, 0, 0, 0, 0],
};

EvaluationView.propTypes = {
    cmtList: PropTypes.array || PropTypes.object,
    rates: PropTypes.array || PropTypes.object,
    productId: PropTypes.string,
};


const mapStateToProps = state => {
    return {
        started: state.app.started,
        isAuth: state.authenticate.isAuth,
        user: state.user,
    };
};
const mapDispatchToProps = dispatch => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EvaluationView);
