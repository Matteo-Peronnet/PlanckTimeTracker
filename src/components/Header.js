import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import logo from '../assets/planck_header_logo.png';
import connect from "react-redux/es/connect/connect";
import { Icon, Menu, Dropdown } from 'antd';
import withUser from "../routes/withUser";
import Avatar from "./Avatar";
import * as actions from '../store/ducks/user';

const SubMenu = Menu.SubMenu;

@connect(
    state => ({
        user: state.user
    }),
    actions
)
@withUser
export default class Header extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    renderMenu = () => (
        <Menu>
            <Menu.Item>1st menu item</Menu.Item>
            <SubMenu title="sub menu">
                <Menu.Item>3rd menu item</Menu.Item>
                <Menu.Item>4th menu item</Menu.Item>
            </SubMenu>
            <Menu.Divider />
            <Menu.Item onClick={() => this.props.logoutRequest()}><Icon type="disconnect" /> Se déconnecter</Menu.Item>
        </Menu>
    );

    render() {

        const { user } = this.props

        return (
            <header className="w-100 ph3 pv3 pv4-ns ph4-m ph5-l" style={{backgroundColor: '#3d324c'}}>
                <nav className="flex items-center justify-between">
                    <Link
                        to="/"
                        style={{ cursor: "pointer" }}
                    >
                        <img src={logo} alt="Planck" height={40} />
                    </Link>
                    {
                        user.isLogged && (
                        <Dropdown overlay={this.renderMenu}>
                            <a className="ant-dropdown-link" href="#">
                                <Avatar userId={user.id}/>
                            </a>
                        </Dropdown>
                        )
                    }
                </nav>
            </header>
        );
    }
};
