import React from 'react'
import './Header.scss'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { redirectToLogin } from '../../modules/admin/actions'

class Header extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    redirectToLogin: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="navbar navbar-default">
        <div className="container">
          <a
            onClick={() => browserHistory.push(`${PREFIX_URL}/`)}
            className="navbar-brand"
          >
            {' '}
            {BRANDING_HEADER_TITLE}
          </a>
          {this.props.loggedIn ? (
            <a
              onClick={() => this.props.redirectToLogin()}
              className="navbar-brand"
              style={{ float: 'right' }}
            >
              Logout
            </a>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  redirectToLogin,
}

const mapStateToProps = (state) => ({
  loggedIn: state.admin.loggedIn,
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
