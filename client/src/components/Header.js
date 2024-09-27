import React from 'react';

const Header = () => {

    return(
        <header>
            <div className='app-logo'>
                <Link to="/">
                    <img src="/assets/raasis_logo.svg" alt="SPA logo" />
                </Link>
            </div>
        </header>
    );
}