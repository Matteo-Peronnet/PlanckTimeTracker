import React, { Component } from "react";
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Layout, Spin } from 'antd';
import { loginRequest } from '../../../store/ducks/user';
import {FormattedMessage, injectIntl} from 'react-intl'
import {intl} from "../../../i18n";
const { Content } = Layout;

@connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        login: (email, password) =>  dispatch(loginRequest({email, password}))
    }),
)
@injectIntl
class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, {userEmail, userPassword}) => {
            if (!err) {
                this.props.login(userEmail, userPassword);
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
                            <h3 className="tc"><FormattedMessage id="pages.login.title" /></h3>
                            <div className="mt3">
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Item>
                                        {getFieldDecorator('userEmail', {
                                            rules: [{ required: true, message: <FormattedMessage id="form.errors.userEmailRequired" />}],
                                        })(
                                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={intl.formatMessage({ id: 'pages.login.form.email' })} />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('userPassword', {
                                            rules: [{ required: true, message: <FormattedMessage id="form.errors.userPasswordRequired" />}],
                                        })(
                                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={intl.formatMessage({ id: 'pages.login.form.password' })} />
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


