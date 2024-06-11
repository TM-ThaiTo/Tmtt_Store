import React, { Component } from 'react';
import { Avatar, Button, Rate } from 'antd';
import { Redirect } from 'react-router-dom';
import { Comment } from '@ant-design/compatible';
import PropTypes from 'prop-types';
import constants from '../../../../constants';
import helpers from '../../../../helpers';

class UserComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMore: false,
            loginRedirect: false
        };
    }

    render() {
        const { comment } = this.props;
        const { author, time, rate, content } = comment;
        const isReduceCmt = content.length >= 200 ? true : false;
        const { isMore, loginRedirect } = this.state;
        const avt = "";
        return (
            <>
                {loginRedirect && <Redirect to="/login" />}

                <Comment
                    author={<b className="author">{author}</b>}
                    avatar={<Avatar src={avt !== '' ? avt : constants.DEFAULT_USER_AVT} alt="" />}
                    content={
                        <>
                            {rate !== -1 && (
                                <>
                                    <Rate defaultValue={rate + 1} disabled style={{ fontSize: 14 }} />
                                    {/* <h3>{helpers.convertRateToText(rate)}</h3> */}
                                </>
                            )}

                            <p className="t-justify">
                                {isMore ? content : content.slice(0, 200)}
                                {isReduceCmt && (
                                    <Button type="link" onClick={() => this.setState({ isMore: !isMore })}>
                                        {isMore ? 'Thu gọn' : 'Xem thêm'}
                                    </Button>
                                )}
                            </p>
                        </>
                    }
                    datetime={<span>{helpers.formatDate(time)}</span>}
                />
            </>
        );
    }
}

UserComment.propTypes = {
    comment: PropTypes.object,
};

export default UserComment;
