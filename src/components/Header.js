import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import logo from '../assets/planck_header_logo.png';
import connect from "react-redux/es/connect/connect";
import {Icon, Menu, Dropdown, Button, Spin} from 'antd';
import withUser from "../routes/withUser";
import Avatar from "./Avatar";
import * as userActions from '../store/ducks/user';
import * as intlActions from '../store/ducks/intl';
import { injectIntl, FormattedMessage } from 'react-intl'
import {currentVersion, forceUpdate, refreshCurrentRoute} from "../events";

const SubMenu = Menu.SubMenu;

@connect(
    state => ({
        user: state.user,
        intl: state.intl,
        loadingRequest: state.planck.loading
    }),
    ({...userActions, ...intlActions})
)
@withUser
@injectIntl
export default class Header extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    renderMenu = () => (
        <Menu key="menu">
            <Menu.Item key="currentVersion" disabled={true}>v{currentVersion}</Menu.Item>
            <Menu.Item key="update" onClick={forceUpdate}><Icon key="icon" type="download" /> <FormattedMessage key="update" id="components.header.menu.update" /></Menu.Item>
            <Menu.Divider key="divider-1" />
            <SubMenu key="language" title={[<Icon key="icon" type="flag" />, <FormattedMessage key="language.title" id="components.header.menu.language.title" />]}>
                <Menu.Item key="fr" onClick={() => this.props.updateIntlRequest('fr')} disabled={this.props.intl.locale === 'fr'}><FormattedMessage id="components.header.menu.language.select.fr" /></Menu.Item>
                <Menu.Item key="en" onClick={() => this.props.updateIntlRequest('en')} disabled={this.props.intl.locale === 'en'}><FormattedMessage id="components.header.menu.language.select.en" /></Menu.Item>
            </SubMenu>
            <Menu.Divider key="divider-2" />
            <Menu.Item key="disconnect" onClick={() => this.props.logoutRequest()}><Icon key="disconnect" type="disconnect" /> <FormattedMessage key="disconnect.title" id="components.header.menu.disconnect.title" /></Menu.Item>
        </Menu>
    );

    render() {
        const { user, loadingRequest } = this.props

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
                            <Fragment>
                                <Button
                                    shape="circle"
                                    icon="redo"
                                    loading={loadingRequest.customers || loadingRequest.projects}
                                    disabled={loadingRequest.customers || loadingRequest.projects}
                                    onClick={() => refreshCurrentRoute()}
                                />
                                <Dropdown overlay={this.renderMenu}>
                                    <a className="ant-dropdown-link">
                                        <Avatar userId={user.id}/>
                                    </a>
                                </Dropdown>
                            </Fragment>
                        )
                    }
                </nav>
            </header>
        );
    }
};
