import React from 'react';
import './WelcomePage.css';
import SearchInput from '../../components/SearchInput/SearchInput';
// import sprite0 from '../../../dragontail-8.21.1/8.21.1/img/sprite/champion0.png';

const WelcomePage = (props) => {
    return (
        <div className="WelcomePage">
            <h1>Project Summoner</h1>
            <SearchInput {...props} handleMatchHistory={props.handleMatchHistory} />
            <h5 className='description'>Project Summoner is a simple web app used to search a player's match history.</h5>
            {/* <img src='/dragontail-8.21.1/8.21.1/img/sprite/champion0.png' /> */}
        </div>
    )
}

export default WelcomePage;