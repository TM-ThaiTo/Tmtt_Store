import React, { Component } from 'react';
import { DownCircleTwoTone, UpCircleTwoTone } from '@ant-design/icons';
import './index.scss';

class ScrollTo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTop: true
        };
        // Binding handleScroll to the component's context
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const _y = window.pageYOffset;
        if (_y >= 350) {
            this.setState({ isTop: false });
        } else {
            this.setState({ isTop: true });
        }
    }

    onScroll = () => {
        const height = document.getElementById('root').clientHeight;
        const top = this.state.isTop ? height : 0;
        window.scrollTo({ top, left: 0, behavior: 'smooth' });
        // Toggling the state directly
        this.setState({ isTop: !this.state.isTop });
    };

    render() {
        return (
            <div className="Scroll-To" style={{ opacity: 0.8 }}>
                {this.state.isTop ? (
                    <DownCircleTwoTone onClick={this.onScroll} className="Scroll-To-arrow" />
                ) : (
                    <UpCircleTwoTone onClick={this.onScroll} className="Scroll-To-arrow" />
                )}
            </div>
        );
    }
}

export default ScrollTo;
