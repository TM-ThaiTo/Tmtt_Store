import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Posts extends Component {
    render() {
        const { desc } = this.props;

        return (
            <>
                {desc == null ? (
                    <h3 className="m-t-16">Thông tin đang được cập nhật</h3>
                ) : (
                    <>
                        {desc.map((section, index) => (
                            <div key={index}>
                                <h2 className="m-t-16 m-b-8 font-weight-700">{section.title}</h2>
                                <div className="underline-title"></div>
                                {section.detailDesList &&
                                    section.detailDesList.map((item, idx) => (
                                        <div key={idx}>
                                            <p className="t-justify font-size-15px font-weight-500 desc-detail">
                                                {item.content}
                                            </p>
                                            {item.photo && (
                                                <img
                                                    className="trans-margin"
                                                    style={{ maxHeight: 350, maxWidth: '100%' }}
                                                    src={item.photo}
                                                    alt={`Description ${idx}`}
                                                />
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </>
                )}
            </>
        );
    }
}

Posts.propTypes = {
    desc: PropTypes.arrayOf(PropTypes.object),
};

export default Posts;
