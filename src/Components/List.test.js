import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

import List from './List';

Enzyme.configure({ adapter: new Adapter() });

describe('<List />', () => {

    it('There are no users.', () => {

        const outer = shallow(<List />);
        const Children = outer.props().children({ mostLiked: { users: [], loadingUsers: false } });
        const wrapper = mount(Children);
        expect(wrapper.props().users).to.be.an('array').that.is.empty;
        expect(wrapper.find('table')).to.have.lengthOf(0);
        expect(wrapper.find('div.alert')).to.have.lengthOf(1);
        expect(wrapper.text()).to.contain('no users...');
    });

    it('Loading.', () => {

        const outer = shallow(<List />);
        const Children = outer.props().children({ mostLiked: { users: [], loadingUsers: true } });
        const wrapper = mount(Children);

        expect(wrapper.props().loading).to.equal(true);
        expect(wrapper.find('table')).to.have.lengthOf(0);
        expect(wrapper.find('div')).to.have.lengthOf(1);
        expect(wrapper.text()).to.contain('Loading users...');
    });

    it('Loaded 2 users.', () => {

        const outer = shallow(<List />);
        const Children = outer.props().children({ mostLiked: { users: [{ _id: 1, username: 1, noOfLikes: 1 }, { _id: 2, username: 2, noOfLikes: 2 }], loadingUsers: false } });
        const wrapper = mount(Children);

        expect(wrapper.props().loading).to.equal(false);
        expect(wrapper.props().users).to.have.lengthOf(2);
        expect(wrapper.find('table')).to.have.lengthOf(1);
        expect(wrapper.find('table > tbody > tr')).to.have.lengthOf(2);
    });
})
