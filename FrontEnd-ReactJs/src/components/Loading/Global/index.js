import React, { Component } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

class GlobalLoading extends Component {
    render() {
        const { content } = this.props;
        return (
            <Spin
                size="large"
                className="Global-Loading trans-center"
                tip={content}
            />
        );
    }
}

GlobalLoading.defaultProps = {
    content: 'Loading...',
};

GlobalLoading.propTypes = {
    content: PropTypes.string,
};

export default GlobalLoading;
