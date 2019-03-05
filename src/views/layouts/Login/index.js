import React, { Component } from "react";
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Layout } from 'antd';

const { Content } = Layout;

@connect(
    state => ({
    }),
    dispatch => ({
    }),
)
class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <Layout>
                <Content style={{ padding: '50px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layout style={{ padding: '25px', background: '#fff', borderRadius: 5 }}>
                        <h3 className="tc">Connexion</h3>
                        <div className="mt3">
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Item>
                                    {getFieldDecorator('userToken', {
                                        rules: [{ required: true, message: 'Veuillez saisir votre token' }],
                                    })(
                                        <Input prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Token" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <div className="tc">
                                        <Button type="primary" htmlType="submit">
                                            Se connecter
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}

export default Form.create({ name: 'login' })(Login);


