import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import constants from '../../../constants/index.js';

class DetailFilter extends Component {
    static defaultProps = {
        visible: false,
        list: [],
        root: constants.ROUTES.FILTER,
    };

    static propTypes = {
        list: PropTypes.array,
        visible: PropTypes.bool,
        root: PropTypes.string,
    };

    genderDetailFilter = (list, root) => {
        return (
            list &&
            list.map((item, index) => (
                <div key={index} className="Filter-detail-item m-b-18">
                    <span className="title">
                        {item.title} <b>&#8919;</b>
                    </span>
                    {item.subFilters.map((sub, key) => (
                        <Link
                            key={key}
                            to={root + '&' + item.query + sub.to}
                            className="sub-filter">
                            <i className="p-lr-6 t">&nbsp;|&nbsp;</i>
                            {sub.title}
                        </Link>
                    ))}
                </div>
            ))
        );
    };

    render() {
        const { list, visible, root } = this.props;
        return (
            <>
                {visible && (
                    <div className="Filter-detail ft_detail">
                        {this.genderDetailFilter(list, root)}
                    </div>
                )}
            </>
        );
    }
}

export default DetailFilter;
