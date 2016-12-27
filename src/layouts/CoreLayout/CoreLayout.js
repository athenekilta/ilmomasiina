import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <span>
    <Header />
    <div className='container'>
      <div className='core-layout__viewport'>
        {children}
      </div>
    </div>
    <div className='footer navbar-fixed-bottom'>
      <Footer />
    </div>
  </span>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
