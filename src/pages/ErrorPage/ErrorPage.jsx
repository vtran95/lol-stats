import React from 'react';
import './ErrorPage.css';
import SearchInput from '../../components/SearchInput/SearchInput';

const ErrorPage = (props) => {
    return (
        <div className="ErrorPage">
            <SearchInput {...props} handleMatchHistory={props.handleMatchHistory} />
            <h4>Could not find a summoner with that name. Please try again.</h4>
        </div>
    )
}

export default ErrorPage;