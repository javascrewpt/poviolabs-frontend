import React from 'react';
import Context from './Context';
import { API, APIAuth } from './api';
import * as JWT from "jsonwebtoken";

// In retrospective, I should have used at least 2 different providers (Auth, Users)
class Provider extends React.Component {

    constructor() {

        super();
        this.state = {
            searchedUser: {
                data: null,
                getUserById: this.getUserById
            },
            user: {
                data: null,
                error: null,
                login: this.handleLogin,
                logout: this.handleLogout,
                like: this.handleLike,
                updatePassword: this.handleUpdatePassword,
                updateStatus: null
            },
            mostLiked: {
                users: [],
                loadingUsers: true
            },
            register: {
                error: null,
                signUp: this.handleSignUp
            }
        };
    }

    /**
     * Helpers
     */

    refreshState = async () => {
        // To keep the <List /> re-rendering to the minimum.

        try {
            const token = localStorage.getItem('token') || null;
            let users = null;
            let user = null;

            if (token) {
                users = await APIAuth(token).get('/most-liked');
                user = this.createUser(token);
            } else {
                users = await API.get('/most-liked');
            }

            this.setState(prevState => {
                return {
                    //...prevState,
                    mostLiked: {
                        users: users.data.users,
                        loadingUsers: false
                    },
                    user: {
                        ...prevState.user,
                        data: user
                    },
                    register: {
                        ...prevState.register,
                        error: null
                    }
                };
            });

        }
        catch (error) {
            console.warn(error);
        }
    }

    createUser = (token) => {

        return { ...JWT.decode(token), token }
    }

    sortUsers = (a, b) => {

        const likes = b.noOfLikes - a.noOfLikes;
        if (likes !== 0) {
            return likes;
        }

        return a.username.localeCompare(b.username);
    }

    /**
     * State handlers
     */

    getUserById = async (_id) => {
        try {
            const response = await API.get(`/user/${_id}`);
            if (response.status === 200) {
                this.setState(prevState => {
                    return {
                        searchedUser: {
                            ...prevState.searchedUser,
                            data: response.data
                        }
                    };
                })
            }
        }
        catch (error) {
            console.warn(error);
        }
    }

    handleLogin = async (username, password) => {

        try {
            const response = await API.post('/login', {
                username, password
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.jwt);
                this.refreshState();
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

                // Could be solved easier with re-populating from the API, i.e., .get('/most-liked')
                this.setState(prevState => {
                    const { users } = prevState.mostLiked;
                    return {
                        mostLiked: {
                            ...prevState.mostLiked,
                            users: [...users.slice(0, index), updatedUser, ...users.slice(index + 1)].sort(this.sortUsers)
                        }
                    };
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    handleUpdatePassword = async (oldPassword, newPassword) => {
        try {
            const token = localStorage.getItem('token') || null;
            if (token) {
                const response = await APIAuth(token).post('/update-password', {
                    oldPassword,
                    newPassword
                });
                if (response.status === 200 && response.data.success) {
                    this.setState(prevState => {

                        return {
                            user: {
                                ...prevState.user,
                                updateStatus: `Password was successfully updated!`
                            }
                        };
                    });
                }
            }
        }
        catch (error) {
            const { message } = error.response.data;
            this.setState(prevState => {
                return {
                    user: {
                        ...prevState.user,
                        updateStatus: message
                    }
                };
            });
        }
    }

    handleSignUp = async (username, password) => {
        try {
            const response = await API.post('/signup', {
                username, password
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.jwt);
                this.refreshState();
            }
        }
        catch (error) {
            const { message } = error.response.data;
            this.setState(prevState => {
                return {
                    register: {
                        ...prevState.register,
                        error: message
                    }
                };
            });
        }
    }

    async componentDidMount() {

        this.refreshState();
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
