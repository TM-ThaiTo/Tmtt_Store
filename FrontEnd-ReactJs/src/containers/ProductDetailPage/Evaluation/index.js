import React, { Component } from 'react';
import { getCommentList } from '../../../services/commentServices';
import PropTypes from 'prop-types';
import EvaluationView from '../../../components/ProductDetail/Evaluation/index.js';

class Evaluation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cmtList: [],
            ratesList: [],
            rateCounts: [],
            totalComment: 0,
        };
    }

    componentDidMount() {
        this.getCommentList();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.productId !== this.props.productId) {
            this.getCommentList();
        }
    }

    //fn: Hàm gọi và lấy list comment
    async getCommentList() {
        const { productId } = this.props;
        try {
            const response = await getCommentList(productId);
            if (response && response.code === 0) {
                this.setState({
                    cmtList: response.data,
                    ratesList: response.rateList,
                    rateCounts: response.rateCounts,
                    totalComment: response.totalComent,
                });
            }
        } catch (error) {
            console.error('Error fetching comment list:', error);
        }
    }

    render() {
        const { productId, rates } = this.props;
        const { cmtList, ratesList, rateCounts, totalComment } = this.state;
        return <EvaluationView productId={productId}
            rates={rates}
            cmtList={cmtList}
            ratesList={ratesList}
            rateCounts={rateCounts}
            totalComment={totalComment}
        />;
    }
}

Evaluation.defaultProps = {
    rates: [],
};

Evaluation.propTypes = {
    productId: PropTypes.string.isRequired,
    rates: PropTypes.arrayOf(PropTypes.number),
};

export default Evaluation;
