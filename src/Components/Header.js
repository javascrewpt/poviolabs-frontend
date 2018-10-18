import React from 'react';
import Login from './Login';
import { Link } from 'react-router-dom';
import { NavLink, Navbar, NavItem, Nav } from 'reactstrap';


const Header = () => (
    <>
        <header>
            <h1>Most liked users app</h1>
        </header>
        <Login />
        <br />
        <br />
        <Navbar color="light" light expand="md">
            <Nav navbar>
                <NavItem>
                    <NavLink tag={Link} to='/'>Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to='/sign-up'>Sign up</NavLink>
                </NavItem>
            </Nav>
        </Navbar>
        <br />
        <br />
    </>
);

export default Header;
