import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';

class DatePickerField extends Component {
    static propTypes = {
        field: PropTypes.object.isRequired,
        form: PropTypes.object.isRequired,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        size: PropTypes.string,
    };

    componentDidMount() {
        const { field } = this.props;
        const { value } = field;
        if (value) {
            this.handleOnChange(moment(value), moment(value).format('DD/MM/YYYY'));
        }
    }

    handleOnChange = (date, dateString) => {
        const { field, form } = this.props;
        const { name } = field;
        form.setFieldValue(name, dateString);
    };

    render() {
        const { field, className, placeholder, size, form } = this.props;
        const { name, value } = field;
        const { errors, touched } = form;
        const showError = errors[name] && touched[name];

        return (
            <>
                <DatePicker
                    className={showError ? `${className} error-input` : className}
                    name={name}
                    placeholder={placeholder}
                    onChange={this.handleOnChange}
                    size={size}
                    format="DD/MM/YYYY"
                    value={value ? moment(value, 'DD/MM/YYYY') : null}
                />
                {showError && <div className="show-error-input">{errors[name]}</div>}
            </>
        );
    }
}

export default DatePickerField;
