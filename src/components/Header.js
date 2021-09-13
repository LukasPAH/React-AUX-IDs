import PropTypes from 'prop-types'

const Header = ({ title }) => {
    return (
        <header>
            <h1 style={headingStyle}>{title}</h1>
            <button>Test</button>
        </header>
    )
}

Header.defaultProps = {
    title: 'Test Component'
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

const headingStyle = {
    color: 'aqua', 
    backgroundColor: 'blue'
}

export default Header
