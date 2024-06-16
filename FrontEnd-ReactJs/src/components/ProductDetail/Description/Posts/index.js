import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./index.scss"

class Posts extends Component {
    render() {
        const { desc } = this.props;
        console.log("Check desc", desc.descItems);
        return (
            <>
                {desc == null ? (
                    <h3 className="m-t-16">Thông tin đang được cập nhật</h3>
                ) : (
                    <div className='post'>
                        <h2 className="title_post">{desc.title}</h2>
                        <div className="underline-title"></div>
                        {desc.descItems.map((section, index) => (
                            <div key={index}>
                                <p className="desc desc-detail">
                                    {section.content}
                                </p>
                                {section.photo && (
                                    <img
                                        className="trans-margin"
                                        style={{ maxHeight: 350, maxWidth: '100%' }}
                                        src={section.photo}
                                        alt={`Description ${index}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </>

        );
    }
}

Posts.propTypes = {
    desc: PropTypes.arrayOf(PropTypes.object),
};

export default Posts;
