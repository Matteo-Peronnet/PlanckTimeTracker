import React, { Component } from "react";
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { getCustomersRequest } from '../../../store/ducks/planck'
import { Menu, Dropdown, Avatar, Icon } from 'antd';
import {Link} from "react-router-dom";
import {Ov} from "../../../utils";
import isPrivate from "../../../routes/isPrivate";


@asyncConnect([
    {
        promise: ({ store: { dispatch, getState } }) => {
            const promises = [];
            const { planck: {entities: {customers}} } = getState();

            if(Ov(customers).length === 0 || Ov(customers).length === 1) {
                promises.push(dispatch(getCustomersRequest()));
            }

            return Promise.all(promises);
        },
    },
])
@connect(
    state => ({
        customers: state.planck.entities.customers,
        projects: state.planck.entities.projects
    }),
    dispatch => ({
    }),
)
@isPrivate
class Home extends React.Component {

    customerMenuProject = (customer) =>
        (
            <Menu>
            {
                customer.projects.map((projectId, key) =>
                    <Menu.Item key={key}>
                        <Link
                            to={`customer/${customer.id}/project/${projectId}`}
                        >
                            {this.props.projects[projectId].name}
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
                  Ov(customers).sort(function(a,b){
                      return a.name.localeCompare(b.name);
                  }).map((customer) => {
                      const avatar = <Avatar
                          style={{margin: "5px", cursor: 'pointer', border: '1px solid #ebedf0'}}
                          key={customer.id}
                          src={`${process.env.PLANCK_HOST}/uploads/customers/logo/${customer.logo}`}
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
                          to={`customer/${customer.id}/project/${customer.projects[0]}`}
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
