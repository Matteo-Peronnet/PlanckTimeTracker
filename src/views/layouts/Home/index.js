import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { getCustomersRequest } from '../../../store/ducks/customer'
import { Menu, Dropdown, Avatar, Icon } from 'antd';


@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const promises = [];
            const { customer: {list: list} } = getState();

            if(list.length === 0) {
                promises.push(dispatch(getCustomersRequest()));
            }
            return Promise.all(promises);
        },
    },
])
@connect(
    state => ({
        customers: state.customer.list
    }),
    dispatch => ({
    }),
)
class Home extends React.Component {

    customerMenuProject = (customer) =>
        (
            <Menu>
            {
                customer.projects.map((project, key) =>
                    <Menu.Item key={key}>
                        {project.name}
                    </Menu.Item>
                )
            }
            </Menu>
        )

    render() {
        const { customers } = this.props;

        return (
            <div className={"flex flex-auto flex-row flex-wrap items-center justify-center pa1"}>
                {
                    customers.map((customer) =>
                        <Dropdown overlay={this.customerMenuProject(customer)} trigger="click">
                        <Avatar
                            style={{margin: "5px", cursor: 'pointer', border: '1px solid #ebedf0'}}
                            key={customer.id}
                            src={`https://planck.troopers.agency/uploads/customers/logo/${customer.logo}`}
                            shape="square" size={70}
                        />
                        </Dropdown>
                    )
                }
            </div>
        );
    }
}

export default Home
