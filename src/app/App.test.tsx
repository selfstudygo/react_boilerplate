import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import 'jest-enzyme';

describe('App', () => {
  it('should have router', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Router)).toExist();
  });
});
