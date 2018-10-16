import React from 'react';
import Context from './Context';
import { API, APIAuth } from './api';
import * as JWT from "jsonwebtoken";

class Provider extends React.Component {
    constructor() {

        super();
        this.state = {
            user: {
                data: this.handleUser(),
                error: null,
                login: this.handleLogin,
                logout: this.handleLogout,
                like: this.handleLike
            },
            mostLiked: {
                users: null,
                loadingUsers: true
            }
        };
    }

    createUser = (token) => {

        return { ...JWT.decode(token), token }
    };

    handleLike = async (whom_id, isALike) => {

        try {
            const { token } = this.state.user.data;
            let response = null;

            if (isALike) {
                response = await APIAuth(token).get(`/user/${whom_id}/like`);
            } else {
                response = await APIAuth(token).get(`/user/${whom_id}/unlike`);
            }
            if (response.status === 200) {
                const index = this.state.mostLiked.users.findIndex(user => user._id === response.data._id);
                const updatedUser = response.data;

                this.setState(prevState => {
                    return {
                        mostLiked: {
                            ...prevState.mostLiked,
                            users: [...prevState.mostLiked.users.slice(0, index), updatedUser, ...prevState.mostLiked.users.slice(index + 1)].sort((a, b) => {
                                const likes = b.noOfLikes - a.noOfLikes;
                                if (likes !== 0) {
                                    return likes;
                                }

                                return a.username.localeCompare(b.username);
                            })
                        }
                    };
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    handleUser = () => {

        const token = localStorage.getItem('token');
        if (token) {
            return this.createUser(token);
        }
        return null;
    }

    handleLogin = async (username, password) => {

        try {
            const response = await API.post('/login', {
                username, password
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.jwt);
                this.setState(prevState => {
                    return {
                        user: {
                            ...prevState.user,
                            data: this.createUser(response.data.jwt)
                        }
                    }
                });
            }
        }
        catch (error) {
            const { message } = error.response.data;
            this.setState(prevState => {
                return {
                    user: {
                        ...prevState.user,
                        error: message
                    }
                };
            });
        }
    }

    handleLogout = () => {

        this.setState(prevState => {
            return {
                user: {
                    ...prevState.user,
                    data: null,
                    error: null
                }
            };
        }, () => {
            localStorage.removeItem('token');
        });
    }

    async componentDidMount() {

        try {
            const { data } = this.state.user;
            let users = null;
            if (data) {
                users = await APIAuth(data.token).get('/most-liked');
            } else {
                users = await API.get('/most-liked');
            }

            setTimeout(() => {
                this.setState(prevState => {

                    return {
                        ...prevState,
                        mostLiked: {
                            users: users.data.users,
                            loadingUsers: false
                        }
                    };
                });
            }, 1500);

        }
        catch (error) {
            console.warn(error);
        }
    }

    render() {

        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default Provider;
