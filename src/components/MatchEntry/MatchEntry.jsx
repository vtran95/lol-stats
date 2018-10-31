import React from 'react';
import './MatchEntry.css';
import {Card, Row, Col} from 'react-materialize';

const MatchEntry = (props) => {

    var cardColour;

    function checkWin() {
        if(props.match.victory) {
            cardColour = 'blue lighten-2'
            return 'Victory';
        } else {
            cardColour = 'red lighten-2'
            return 'Defeat';
        }
    }

    /* function for displaying items horizontally

    function getItems() {
        var display1 = [];
        var display2 = [];
        for(var i=0; i<props.match.items.length; i++) {
            if((i <= 2) || i === 6) {
                display1.push((i+1) +': '+ props.match.items[i]);
            } else {
                display2.push((i+1) +': '+ props.match.items[i]);
            }
        }
        return <div>
                    <div>
                        {display1.map((item) => {
                            return <span>{item}</span>
                        })}
                    </div>
                    <div>
                        {display2.map((item) => {
                            return <span>{item}</span>
                        })}
                    </div>
                </div>;
    }
    */

    function displayItems() {
        var i = 0;
        return <div className='items'>
                    {props.match.items.map((item) => {
                        i++;
                        return <p>Item slot {i}: {item}</p>
                    })}
                </div>
            
    }

    function displayTeams() {
        var team1 = [];
        var team2 = [];
        if(props.match.players.length < 6) {
            return <div className='team'>
                        {props.match.players.map(player => {
                            return <div className='player'>
                                        {getChampIcon(player.icon)}
                                        <div className='player-names'>
                                            <p>{player.champion}</p>
                                            <p>{player.name}</p>
                                        </div>
                                    </div>
                        })}
                    </div>
        } else {
            teamSet(props.match.players.length, team1, team2);
            return <div className='teams'>
                        <div className='team'>
                            {team1.map(player => {
                                return <div className='player'>
                                            {getChampIcon(player.icon)}
                                            <div className='player-names'>
                                                <p>{player.champion}</p>
                                                <p>{player.name}</p>
                                            </div>
                                        </div>
                            })}
                        </div>
                        <div className='vs'>VS</div>
                        <div className='team'>
                            {team2.map(player => {
                                return <div className='player'>
                                            {getChampIcon(player.icon)}
                                            <div className='player-names'>
                                                <p>{player.champion}</p>
                                                <p>{player.name}</p>
                                            </div>
                                        </div>
                            })}
                        </div>
                    </div>
        }
    }

    function teamSet(total, team1, team2) {
        var half = total / 2;
        for(var i = 0; i < half; i++) {
            team1.push(props.match.players[i]);
        }
        for(var j = half; j < total; j++) {
            team2.push(props.match.players[j]);
        }
    }

    function gameTime() {
        var time = props.match.gameLength;
        var minutes = Math.floor(time/60);
        var seconds = time - minutes * 60;

        return minutes + ' min ' + seconds + ' sec ';
    }

    function getChampIcon(champ) {
        var strLink = 'http://ddragon.leagueoflegends.com/cdn/8.21.1/img/champion/' + champ;
        return <img src={strLink} alt={champ} />
    }

    return (
        <Card title={checkWin()} className={cardColour} textClassName='white-text'>
            <Row className='cardClass'>
                <Col s={4} m={4}>
                <div className='sumInfo'>
                    <div className='champion'>
                        {getChampIcon(props.match.champIcon)}
                        <h5>{props.match.champName}</h5>
                        <div>
                            Level {props.match.champLevel}
                        </div>
                    </div>
                    <div>
                        <div className= 'spell-runes'>
                            <p>{props.match.sumSpells[0]}</p>
                            <p>{props.match.sumSpells[1]}</p>
                        </div>
                        <div className= 'spell-runes'>
                            <p>{props.match.sumRunes.keystone}</p>
                            <p>{props.match.sumRunes.path}</p>
                        </div>
                    </div>
                    <div className='stats'>
                        <p>
                            {gameTime()}
                        </p>
                        <p>
                            {props.match.kda.kills} / {props.match.kda.deaths} / {props.match.kda.assists}
                        </p>
                        <p>
                            {props.match.kda.ratio} : 1 KDA
                        </p>
                        <p>
                            CS Total: {props.match.csTotal}
                        </p>
                        <p>
                            Per min: {props.match.csPerMin}
                        </p>
                    </div>
                    </div>
                </Col>
                <Col s={3} m={3}>
                    {displayItems()}
                </Col>
                <Col s={5} m={5}>
                    {displayTeams()}
                </Col>
            </Row>
        </Card>
    );  
}

export default MatchEntry;