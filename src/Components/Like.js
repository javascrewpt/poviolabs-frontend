import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

class Like extends React.Component {

    clickHandler = (e, isALike = true) => {

        e.preventDefault();

        const { user, auth, like } = this.props;
        if (user._id === auth._id) {
            alert(`You can't like yourself and you should be ashamed for trying!`);
        } else {
            if (isALike) {
                like(user._id, true);
            } else {
                like(user._id, false);
            }
        }
    }

    render() {

        const { auth, user } = this.props;
        let content = <div>Log in to like!</div>;
        if (auth && user.didLike) {
            content = <Button color="link" onClick={e => { this.clickHandler(e, false); }}>Unlike</Button>
        } else if (auth && !user.didLike) {
            content = <Button color="link" onClick={this.clickHandler}>Like</Button>
        }

        return (
            <>
                {content}
            </>
        );
    }
}

Like.propTypes = {
    auth: PropTypes.object,
    user: PropTypes.object,
    like: PropTypes.func
};

export default Like;
