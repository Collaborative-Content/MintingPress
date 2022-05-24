import React from 'react'
import { func, string } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudMoon, faSun } from '@fortawesome/free-solid-svg-icons'

const Toggle = ({theme,  toggleTheme }) => {
    return (
        <FontAwesomeIcon icon={theme === 'light' ? faCloudMoon : faSun} onClick={toggleTheme} inverse/>
    );
};

Toggle.propTypes = {
    theme: string.isRequired,
    toggleTheme: func.isRequired,
}

export default Toggle;
