import React, { Component } from "react";

import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;



export default class App extends React.Component {

    state = {
        current: 'mail',
    }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
            >
                <Menu.Item key="client" style={{width: `40%`, textAlign: 'center'}}>
                    <Icon type="team" /> Clients
                </Menu.Item>
                <Menu.Item key="app" style={{width: `40%`, textAlign: 'center'}}>
                    <Icon type="dashboard" /> Timer
                </Menu.Item>
                <Menu.Item key="settings" style={{width: `20%`, textAlign: 'center'}}>
                    <Icon type="tool" />
                </Menu.Item>
            </Menu>
        );
    }
}
