import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

export default (WrappedComponent) => {
    const WithSecurity = (props) => {
        if (!props.isLogged) {
            return <Redirect to="/login" />
        }

        return <WrappedComponent {...props} />
    }

    WithSecurity.propTypes = {
        isLogged: PropTypes.bool,
    }

    const mapStateToProps = (state) => ({
        isLogged: false
    })

    return connect(mapStateToProps)(WithSecurity)
}
