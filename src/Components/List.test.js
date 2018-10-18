import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router } from "react-router-dom";

import List from './List';

Enzyme.configure({ adapter: new Adapter() });

describe('<List />', () => {

    it('There are no users.', () => {

        const outer = shallow(<List location={{ pathname: '/' }} />);
        const Children = outer.props().children({
            mostLiked: {
                users: [],
                loadingUsers: false
            },
            user: {
                data: null
            }
        });
        const wrapper = mount(Children);

        expect(wrapper.props().users).to.be.an('array').that.is.empty;
        expect(wrapper.find('table')).to.have.lengthOf(0);
        expect(wrapper.find('div.alert')).to.have.lengthOf(1);
        expect(wrapper.text()).to.contain('no users...');
    });

    it('Loading.', () => {

        const outer = shallow(<List location={{ pathname: '/' }} />);
        const Children = outer.props().children({
            mostLiked: {
                users: [],
                loadingUsers: true
            },
            user: {
                data: null
            }
        });
        const wrapper = mount(Children);

        expect(wrapper.props().loading).to.equal(true);
        expect(wrapper.find('table')).to.have.lengthOf(0);
        expect(wrapper.find('div')).to.have.lengthOf(1);
        expect(wrapper.text()).to.contain('Loading users...');
    });

    it('Loaded 2 users, check likes.', () => {

        const outer = shallow(<List location={{ pathname: '/' }} />);

        const Children = outer.props().children({
            mostLiked: {
                users: [{ _id: 1, username: 'Janez', noOfLikes: 1 }, { _id: 2, username: 'Jure', noOfLikes: 2 }],
                loadingUsers: false
            },
            user: {
                data: null
            }
        });
        const wrapper = mount(<Router>{Children}</Router>);
        const listWrapper = wrapper.children().props().children.props;

        expect(listWrapper.loading).to.equal(false);
        expect(listWrapper.users).to.have.lengthOf(2);
        expect(wrapper.find('table')).to.have.lengthOf(1);
        expect(wrapper.find('table > tbody > tr')).to.have.lengthOf(2);

        expect(wrapper.find('table > tbody > tr').at(0).find('td').at(0).text().trim()).to.equal('Janez');
        expect(wrapper.find('table > tbody > tr').at(0).find('td').at(1).text().trim()).to.equal('1');

        expect(wrapper.find('table > tbody > tr').at(1).find('td').at(0).text().trim()).to.equal('Jure');
        expect(wrapper.find('table > tbody > tr').at(1).find('td').at(1).text().trim()).to.equal('2');
    });

});

