import React from "react";
import PropTypes from 'prop-types';
import {
    Form, Input, Select, DatePicker
} from 'antd';
import {FormattedMessage, injectIntl} from 'react-intl'
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

@injectIntl
class TimerInformation extends React.Component {

    static propTypes = {
        timeSpentTypes: PropTypes.array.isRequired,
        form: PropTypes.object.isRequired,
    }

    state = {
        confirmDirty: false,
    };

    render = () => {

        const { getFieldDecorator } = this.props.form;
        const { timeSpentTypes } = this.props;


        return (
            <Form className="w-100 flex items-center justify-center flex-column" style={{padding: '10px 40px'}} onSubmit={this.handleSubmit}>
                <Form.Item
                    label={<FormattedMessage id="pages.timer.form.type" />}
                    hasFeedback
                    className="w-100"
                    style={{margin: 0}}
                >
                    {getFieldDecorator('select', {
                        rules: [
                            { required: true, message: <FormattedMessage id="form.errors.selectType" /> },
                        ],
                        initialValue: timeSpentTypes[0].id
                    })(
                        <Select>
                            {
                                timeSpentTypes.map((timeSpentType) =>
                                    <Option key={timeSpentType.id} value={timeSpentType.id}>{timeSpentType.label}</Option>
                                )
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="pages.timer.form.description" />}
                    hasFeedback
                    className="w-100"
                    style={{margin: 0}}
                >
                    {getFieldDecorator('description', {
                        rules: [{ required: false, message: <FormattedMessage id="form.errors.fillDescription" />, whitespace: true }],
                    })(
                        <TextArea rows={2} />
                    )}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="pages.timer.form.startDate" />}
                    hasFeedback
                    className="w-100"
                    style={{margin: 0}}
                >
                    {getFieldDecorator('startDate', {
                        rules: [{ type: 'object', required: true, message: <FormattedMessage id="form.errors.selectDate" /> }],
                        initialValue: moment()
                    })(
                        <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                    )}
                </Form.Item>
            </Form>
        )
    }


};

export default TimerInformation;
