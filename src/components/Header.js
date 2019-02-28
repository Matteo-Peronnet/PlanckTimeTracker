import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/planck_header_logo.png';
import { Icon } from 'antd';

export default () => {
    return (
        <header className="w-100 ph3 pv3 pv4-ns ph4-m ph5-l" style={{backgroundColor: '#3d324c'}}>
            <nav className="flex items-center justify-between">
                <Link
                    to="/"
                    style={{ cursor: "pointer" }}
                >
                    <img src={logo} alt="Planck" height={40} />
                </Link>
                <Link
                    to="/settings"
                    style={{ cursor: "pointer" }}
                >
                    <Icon type="setting" className="f4 white" theme="filled" />
                </Link>
            </nav>
        </header>
    );
};