import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

class SelectField extends Component {
    static defaultProps = {
        placeholder: '',
        size: 'large',
        options: [],
    };

    static propTypes = {
        field: PropTypes.object.isRequired,
        form: PropTypes.object.isRequired,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        options: PropTypes.array,
        size: PropTypes.string,
    };

    handleOnChange = (value) => {
        const { field } = this.props;
        const { name } = field;
        const changeEvent = {
            target: {
                name,
                value,
            },
        };
        field.onChange(changeEvent);
    };

    render() {
        const { field, className, placeholder, options, size, form } = this.props;
        const { name, value } = field;
        const { errors, touched } = form;
        const showError = errors[name] && touched[name];

        return (
            <Select
                name={name}
                {...field}
                className={showError ? className + ' error-input' : className}
                placeholder={placeholder}
                size={size}
                onChange={this.handleOnChange}
                value={value}
            >
                {options.map((option, index) => (
                    <Select.Option key={index} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

export default SelectField;
