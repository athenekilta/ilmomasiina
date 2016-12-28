import React from 'react';
import { Header } from 'components/Header/Header';
import { shallow } from 'enzyme';

describe('(Component) Header', () => {
  let _wrapper;

  beforeEach(() => {
    _wrapper = shallow(<Header />);
  });

  it('Renders a header link', () => {
    const headerLink = _wrapper.find('IndexLink');
    expect(headerLink).to.exist;
  });
});
