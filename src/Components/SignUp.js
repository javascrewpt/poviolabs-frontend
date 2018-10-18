import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Popover, PopoverBody, Alert } from 'reactstrap';
import PropTypes from 'prop-types';

import Context from '../State/Context';

class SignUp extends Component {

    constructor(props) {

        super(props);
        this.state = {
            userMessage: null,
            passMessage: null
        };
    }

    generateUser = (e, names) => {

        const user = {};
        for (const name of names) {
            user[name] = e.target[name].value;
        }
        return user;
    }

    submitHandler = (e) => {

        e.preventDefault();
        const user = this.generateUser(e, ["signUpUsername", "signUpPassword", "signUpPassword2"]);

        this.setState(
            prevState => {
                return {
                    userMessage: user.signUpUsername.length <= 0 ? "Username is empty!" : null,
                    passMessage:
                        user.signUpPassword.length <= 0
                            ? "Password is empty!"
                            : user.signUpPassword !== user.signUpPassword2
                                ? "Passwords don't match!"
                                : null
                };
            },
            () => {
                if (!this.state.userMessage && !this.state.passMessage) {
                    this.props.signUp(user.signUpUsername, user.signUpPassword);
                }
            }
        );
    }

    render() {

        const { userMessage, passMessage } = this.state;
        const error = this.props.error;

        return (
            <>
                {!this.props.user ?
                    <>
                        <Alert color="danger" isOpen={error ? true : false}> {error}</Alert>
                        <Form onSubmit={this.submitHandler}>
                            <FormGroup>
                                <Label for="signUpUsername">Username</Label>
                                <Input type="text" name="signUpUsername" className="danger" id="signUpUsername" invalid={userMessage ? true : false} />
                                {userMessage
                                    ?
                                    <Popover placement="left" isOpen={userMessage ? true : false} target="signUpUsername">
                                        <PopoverBody>{userMessage}</PopoverBody>
                                    </Popover>
                                    :
                                    ''}
                            </FormGroup>
                            <FormGroup>
                                <Label for="signUpPassword">Password</Label>
                                <Input type="password" name="signUpPassword" id="signUpPassword" invalid={userMessage ? true : false} />
                                {passMessage
                                    ?
                                    <Popover placement="left" isOpen={passMessage ? true : false} target="signUpPassword">
                                        <PopoverBody>{passMessage}</PopoverBody>
                                    </Popover>
                                    :
                                    ''}
                            </FormGroup>
                            <FormGroup>
                                <Label for="signUpPassword2">Repeat password</Label>
                                <Input type="password" name="signUpPassword2" id="signUpPassword2" />
                            </FormGroup>
                            <Button>Submit</Button>
                        </Form>
                    </>
                    : <Alert color="info">
                        <h4 className="alert-heading">Hi there, <strong>{this.props.user.username}</strong>!</h4>
                        <p>You are part of the system now.</p>
                    </Alert>}
            </>
        );
    }
}

SignUp.propTypes = {
    signUp: PropTypes.func,
    error: PropTypes.string,
    user: PropTypes.object
};

export default props => (
    <Context.Consumer>
        {state => (
            <SignUp user={state.user.data} signUp={state.register.signUp} error={state.register.error} {...props} />
        )}
    </Context.Consumer>
);
