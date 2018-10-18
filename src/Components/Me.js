import React, { Fragment } from 'react';
import { Alert, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';

import Context from '../State/Context';

class Me extends React.Component {

    state = {
        errors: []
    }

    submitHandler = (e) => {

        e.preventDefault();
        const names = ['oldPassword', 'newPassword', 'newPassword2'];
        let message = [];
        const user = {};

        for (const name of names) {
            user[name] = e.target[name].value;
        }

        if (user.oldPassword.length < 3) {
            message.push(`Old password is too short! Must be at least 3 chars, you inserted ${user.oldPassword.length}.`);
        }

        if (user.newPassword.length < 3) {
            message.push(`New password is too short! Must be at least 3 chars, you inserted ${user.newPassword.length}.`);
        }

        if (user.newPassword !== user.newPassword2) {
            message.push(`New passwords do not match!`);
        }

        if (message.length === 0) {
            this.props.update(user.oldPassword, user.newPassword);
        } else {
            this.setState(prevState => {
                return {
                    errors: message
                };
            });
        }

        e.target.reset();
    }

    render() {

        const { status } = this.props;
        const { errors } = this.state;
        const lenghtOfErros = errors.length;

        return <>
            <Alert color="info" isOpen={status ? true : false}>
                {status}
            </Alert>
            <Alert color="danger" isOpen={lenghtOfErros > 0 ? true : false}>
                <h4 className="alert-heading">Here's what you've done wrong!</h4>
                {
                    /* I really shouldn't be assigning index to key, but the list isn't dynamic! */
                    errors.map((error, index) => (
                        <Fragment key={index}>
                            <p>{error}</p>
                            {lenghtOfErros - 1 > index ? <hr /> : ''}
                        </Fragment>
                    ))}
            </Alert>
            <Form onSubmit={this.submitHandler}>
                <FormGroup>
                    <Label for="oldPassword">Old password</Label>
                    <Input type="password" name="oldPassword" id="oldPassword" />
                </FormGroup>
                <FormGroup>
                    <Label for="newPassword">New password</Label>
                    <Input type="password" name="newPassword" id="newPassword" />
                </FormGroup>
                <FormGroup>
                    <Label for="newPassword2">Repeat new password</Label>
                    <Input type="password" name="newPassword2" id="newPassword2" />
                </FormGroup>
                <Button>Submit</Button>
            </Form>

        </>
    }
}

Me.propTypes = {
    update: PropTypes.func,
    status: PropTypes.string
}

export default props => (
    <Context.Consumer>
        {state => (<Me update={state.user.updatePassword} status={state.user.updateStatus} {...props} />)}
    </Context.Consumer>
);
