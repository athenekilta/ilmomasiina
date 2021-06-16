import React from 'react';

import { shallow } from 'enzyme';

import { Header } from '../../src/components/Header/Header';

describe('(Component) Header', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  it('Renders a header link', () => {
    const headerLink = wrapper.find('IndexLink');
    return expect(headerLink).to.exist;
  });
});
