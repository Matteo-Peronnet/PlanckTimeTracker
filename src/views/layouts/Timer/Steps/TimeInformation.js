import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import {
    Form, Input, Select, DatePicker, TimePicker
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

class TimeInformation extends React.Component {

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
                    label="Type"
                    hasFeedback
                    className="w-100"
                    style={{margin: 0}}
                >
                    {getFieldDecorator('select', {
                        rules: [
                            { required: true, message: 'Séléctionner un type' },
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
                    label="Description"
                    hasFeedback
                    className="w-100"
                    style={{margin: 0}}
                >
                    {getFieldDecorator('description', {
                        rules: [{ required: false, message: 'Entrez une description', whitespace: true }],
                    })(
                        <TextArea rows={2} />
                    )}
                </Form.Item>
                <Form.Item
                    label="Date début"
                    hasFeedback
                    className="w-100"
                    style={{margin: 0}}
                >
                    {getFieldDecorator('startDate', {
                        rules: [{ type: 'object', required: true, message: 'Merci de séléctionner une date' }],
                    })(
                        <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                    )}
                </Form.Item>
            </Form>
        )
    }


};

export default TimeInformation;
