import React from 'react';
import { Button, Form, FormGroup, Label, Input, Alert, Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Context from '../State/Context';

class Login extends React.Component {

    constructor() {

        super();
        this.state = {
            chkUser: false,
            chkPass: false
        };

    }

    handleForm = (e) => {

        e.preventDefault();
        const { username, password } = e.target;
        this.props.login(username.value, password.value);
    }

    handleInput = (e, name) => {

        const status = (e.target.value.trim().length >= 3) ? true : false;
        this.setState(prevState => {
            return {
                [name]: status
            };
        });
    }

    handleLogout = () => {
        this.props.logout();
        this.setState(prevState => {
            return {
                chkUser: false,
                chkPass: false
            };
        });
    }

    render() {
        const { chkUser, chkPass } = this.state;
        const { user, error } = this.props;

        return user ? (
            <div>
                Hello, <Badge tag={Link} to='/me' color="success" pill>{user.username}</Badge >! <Badge href="#" color="light" onClick={this.handleLogout}>Logout</Badge>
            </div>
        ) : (
                <>
                    {error && <Alert color="danger">{error}</Alert>}
                    <Form inline onSubmit={this.handleForm}>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="username" className="mr-sm-2">Username</Label>
                            <Input type="text" name="username" id="username" onChange={e => { this.handleInput(e, 'chkUser') }} />
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="password" className="mr-sm-2">Password</Label>
                            <Input type="password" name="password" id="password" onChange={e => { this.handleInput(e, 'chkPass') }} />
                        </FormGroup>
                        <Button color="primary" disabled={!chkUser || !chkPass}>Submit</Button>
                    </Form>
                </>
            );
    }
}

Login.propTypes = {
    user: PropTypes.object,
    error: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func
};

export default props => (
    <Context.Consumer>
        {state => (
            <Login user={state.user.data} error={state.user.error} login={state.user.login} logout={state.user.logout} {...props} />
        )}
    </Context.Consumer>
);
