import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router } from "react-router-dom";

import Login from './Login';

Enzyme.configure({ adapter: new Adapter() });

describe('<Login />', () => {

    it('User not logged, show form.', () => {
        const outer = shallow(<Login />);
        const Children = outer.props().children({ user: { data: null, login: jest.fn(), logout: jest.fn(), error: null } });
        const wrapper = mount(Children);

        expect(wrapper.find('form')).to.have.lengthOf(1);
    })

    it('Submit button disabled/enabled.', () => {
        const outer = shallow(<Login />);
        const Children = outer.props().children({ user: { data: null }, login: jest.fn(), logout: jest.fn() });
        const wrapper = mount(Children);

        expect(wrapper.find('button')).to.have.lengthOf(1);

        wrapper.setState({ chkUser: false, chkPass: false });
        expect(wrapper.find('button').props()['disabled']).to.be.true;

        wrapper.setState({ chkUser: true, chkPass: true });
        expect(wrapper.find('button').props()['disabled']).to.be.false;
    });

    it('Used logged.', () => {
        const outer = shallow(<Login />);
        const Children = outer.props().children({ user: { data: { _id: 1, username: 'DummyUser', noOfLikes: 1 } }, login: jest.fn(), logout: jest.fn() });
        const wrapper = mount(<Router>{Children}</Router>);

        expect(wrapper.props().user).to.not.be.a('null')
        expect(wrapper.text()).to.contain('DummyUser');
        expect(wrapper.find('form')).to.have.lengthOf(0);
    });
});
