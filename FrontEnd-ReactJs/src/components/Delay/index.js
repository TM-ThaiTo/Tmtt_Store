import { Component } from 'react';
import PropTypes from 'prop-types';

class Delay extends Component {
    static propTypes = {
        wait: PropTypes.number,
        children: PropTypes.node.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            waiting: true
        };
    }

    componentDidMount() {
        const { wait } = this.props;
        this.timer = setTimeout(() => {
            this.setState({ waiting: false });
        }, wait);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const { waiting } = this.state;
        const { children } = this.props;

        return waiting ? null : children;
    }
}

export default Delay;
