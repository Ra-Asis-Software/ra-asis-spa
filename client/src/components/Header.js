import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

    return(
        <header>
            <div className='app-logo'>
                <Link to="/">
                    <img src="/assets/spa_logo.svg" alt="SPA logo" />
                </Link>
            </div>
        </header>
    );
}

export default Header;