import React from 'react';
import './WelcomePage.css';
import SearchInput from '../../components/SearchInput/SearchInput';

const WelcomePage = (props) => {
    return (
        <div className="WelcomePage">
            <h1>Welcome, Summoner.</h1>
            <SearchInput handleMatchHistory={props.handleMatchHistory} />
        </div>
    )
}

export default WelcomePage;