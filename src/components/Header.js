import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import logo from '../assets/planck_header_logo.png';
import { Icon, Affix } from 'antd';
import withUser from "../routes/withUser";
import Avatar from "./Avatar";

@withUser
export default class Header extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
    }

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
                        user.isLogged && (<Link
                            to="/settings"
                            style={{ cursor: "pointer" }}
                        >
                            <Avatar userId={43}/>
                        </Link>)
                    }
                </nav>
            </header>
        );
    }
};
