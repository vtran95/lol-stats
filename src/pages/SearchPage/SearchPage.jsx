import React from 'react';
import './SearchPage.css';
import MatchEntry from '../../components/MatchEntry/MatchEntry';
import SearchInput from '../../components/SearchInput/SearchInput';

const SearchPage = (props) => {
    return (
        <div>
            <SearchInput {...props} handleMatchHistory={props.handleMatchHistory} />
            <h2>{props.matchHistory.name}</h2>
            {props.matchHistory.matches.map(match =>
                <MatchEntry match={match} />
            )}
        </div>
    );  
}

export default SearchPage;