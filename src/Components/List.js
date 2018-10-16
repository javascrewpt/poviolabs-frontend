import React from 'react';
import { Table, Alert } from 'reactstrap';
import PropTypes from 'prop-types';

import Context from '../State/Context';
import Like from './Like';

class List extends React.Component {

    render() {
        const { users, loading, user: auth, like } = this.props;
        let content = <div>Loading users...</div>;

        if (!loading) {
            if (users && users.length > 0) {
                content = <Table bordered>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>No. of likes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.noOfLikes}</td>
                                <td>
                                    <Like auth={auth} user={user} like={like} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>;
            } else {
                content = <Alert color="danger">There are no users...</Alert>;
            }
        }

        return (
            <>{content}</>
        );
    }
}

List.propTypes = {
    users: PropTypes.array,
    user: PropTypes.object,
    loading: PropTypes.bool,
    like: PropTypes.func
};

export default props => <Context.Consumer>
    {state => (
        <List users={state.mostLiked.users} loading={state.mostLiked.loadingUsers} user={state.user.data} like={state.user.like} />
    )}
</Context.Consumer>;
