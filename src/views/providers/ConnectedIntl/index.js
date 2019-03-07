import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl-redux'
import PropTypes from 'prop-types'

const mapStateToProps = (state) => ({
    currentLocale: state.intl.locale,
})

class ConnectedIntl extends PureComponent {
    static propTypes = {
        currentLocale: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
    }

    render() {
        return <IntlProvider key={this.props.currentLocale}>{this.props.children}</IntlProvider>
    }
}

export default connect(mapStateToProps)(ConnectedIntl)
