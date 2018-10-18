import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

import SignUp from './SignUp';

Enzyme.configure({ adapter: new Adapter() });

describe('<SignUp />', () => {

    it('User not logged, show signup form.', () => {
        const outer = shallow(<SignUp />);
        const Children = outer.props().children({
            user: {
                data: null
            },
            register: {
                signUp: jest.fn(),
                error: null
            }
        });
        const wrapper = mount(Children);

        expect(wrapper.find('form')).to.have.lengthOf(1);
    });

    it('User logged, show notification.', () => {
        const outer = shallow(<SignUp />);
        const Children = outer.props().children({
            user: {
                data: { _id: 1, username: 'Janez' }
            },
            register: {
                signUp: jest.fn(),
                error: null
            }
        });
        const wrapper = mount(Children);
        wrapper.setState({ userMessage: 'Username is empty!', passMessage: null });

        expect(wrapper.find('form')).to.have.lengthOf(0);
        expect(wrapper.find('.alert-heading').text()).to.contain('Hi there, Janez!');
    });

});
