import React, { Component } from "react";
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Layout, Spin } from 'antd';
import { loginRequest } from '../../../store/ducks/user';
import {FormattedMessage, injectIntl} from 'react-intl'
const { Content } = Layout;

@connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        login: (token) =>  dispatch(loginRequest(token))
    }),
)
@injectIntl
class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, {userToken}) => {
            if (!err) {
                this.props.login(userToken);
            }
        });
    }

    render() {

        const { user } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <Layout>
                <Content style={{ padding: '50px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin spinning={user.loading}>
                        <Layout style={{ padding: '25px', background: '#fff', borderRadius: 5 }}>
                            <h3 className="tc"><FormattedMessage id="pages.login.title" /> 1.0.3</h3>
                            <div className="mt3">
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Item>
                                        {getFieldDecorator('userToken', {
                                            rules: [{ required: true, message: <FormattedMessage id="form.errors.userTokenRequired" />}],
                                        })(
                                            <Input prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Token" />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <div className="tc">
                                            <Button type="primary" htmlType="submit">
                                                <FormattedMessage id="pages.login.connexion" />
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Layout>
                    </Spin>
                </Content>
            </Layout>
        );
    }
}

export default Form.create({ name: 'login' })(Login);


