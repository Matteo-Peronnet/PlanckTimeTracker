import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { getCustomersRequest } from '../../../store/ducks/customer'
import { Menu, Dropdown, Avatar, Icon } from 'antd';
import {Link} from "react-router-dom";


@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const promises = [];
            const { customer: {list: list} } = getState();

            if(list.length === 0 || list.length === 1) {
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
                        <Link
                            to={`customer/${customer.id}/project/${project.id}`}
                        >
                            {project.name}
                        </Link>
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
                  customers.map((customer) => {
                      const avatar = <Avatar
                          style={{margin: "5px", cursor: 'pointer', border: '1px solid #ebedf0'}}
                          key={customer.id}
                          src={`https://planck.troopers.agency/uploads/customers/logo/${customer.logo}`}
                          shape="square" size={70}
                      />

                      if(customer.projects.length > 1) {
                          return <Dropdown
                              key={customer.id}
                              overlay={this.customerMenuProject(customer)}
                              trigger={['click']}>
                              {avatar}
                          </Dropdown>
                      }
                      return <Link
                          key={customer.id}
                          to={`customer/${customer.id}/project/${customer.projects[0].id}`}
                      >
                          {avatar}
                      </Link>
                  })
                }
            </div>
        );
    }
}

export default Home
