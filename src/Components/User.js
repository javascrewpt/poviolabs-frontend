import React, { Component } from 'react';
import { Alert, Card, Button, CardTitle, CardText } from 'reactstrap';
import PropTypes from 'prop-types';

import Context from '../State/Context';

class User extends Component {

    componentDidMount() {

        this.props.getUserById(this.props.match.params.id)
    }

    render() {

        const { user } = this.props;
        let content = <Alert color="info">Loading...</Alert>;

        if (user) {
            content = <Card body>
                <CardTitle>{user.username}</CardTitle>
                <CardText>This user was liked an amazing {user.noOfLikes} times!</CardText>
                <Button outline onClick={e => this.props.history.goBack()} color="primary">Go back!</Button>
            </Card>
        }

        return <>{content}</>;
    }
}

User.propTypes = {
    getUserById: PropTypes.func,
    user: PropTypes.object,
    location: PropTypes.object.isRequired
}

export default props => (
    <Context.Consumer>
        {state => (
            <User getUserById={state.searchedUser.getUserById} user={state.searchedUser.data} {...props} />
        )}
    </Context.Consumer>
);
