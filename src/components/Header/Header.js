import React from 'react'
import { Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div className='navbar navbar-default'>
    <div className='container'>
      <Link href='/' className="navbar-brand" href="#">Ilmo.io</Link>
    </div>
  </div>
)

export default Header
