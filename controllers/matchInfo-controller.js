var LeagueJs = require('LeagueJS');
const matchInfo = require ('../models/matchInfo');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);

// function show(req, res) {
//     console.log(req.params.id);
//     leagueJs.Summoner.gettingByName(req.params.id)
//     .then(data => {
//         'use strict';
//         console.log(data);
//         var matchHist = new matchInfo;
//         matchHist.sumName = data.name;
//         matchHist.actId = data.accountId;
//         leagueJs.Match.gettingListByAccount(data.accountId)
//         .then()
//     })
//     .catch(err => {
//         'use strict';
//         console.log(err);
//     });
//     return;
// }

async function show(req, res) {
        let summoner = await leagueJs.Summoner.gettingByName(req.params.id);
        let matchList = await leagueJs.Match.gettingRecentListByAccount(summoner.accountId);
        // console.log(matchList);
        var matches = [];
        // matchList.matches.forEach(async function(match) {
        //    let getMatch = await leagueJs.Match.gettingById(match.gameId);
        //    matches.push(getMatch);
        // })

        var mainParticipantId = [];
        var recentMatchHistory = [];
        var champions = [];
        // matches.forEach(async function(match) {
        //     var newMatchHistory = new matchInfo;
        //     match.participantIdentities.forEach(function(participant) {
        //         if(participant.player.summonerName === summoner.name) {
        //             participantId.push(participant.participantId);
        //         }
        //         newMatchHistory.players.push({playerId: participant.participantId , name: participant.player.summonerName})
        //     })
        //     // for (var i = 0; i < match.participants.length; i++) {
        //     //     let champ = await leagueJs.StaticData.gettingChampionById(match.participants[i].championId);
        //     //     newMatchHistory.players[i].champion = champ.name;
        //     // }
        //     recentMatchHistory.push(newMatchHistory);
        // })

        for (const match of matchList.matches) {
            let getMatch = await leagueJs.Match.gettingById(match.gameId);
            matches.push(getMatch);

            var newMatchHistory = new matchInfo;
            newMatchHistory.sumName = summoner.name;
            newMatchHistory.gameLength = getMatch.gameDuration;

            getMatch.participantIdentities.forEach(function(participant) {
                if(participant.player.summonerName === summoner.name) {
                    mainParticipantId.push(participant.participantId);
                }
                newMatchHistory.players.push({playerId: participant.participantId , name: participant.player.summonerName});
            })
            for (var i = 0; i < getMatch.participants.length; i++) {
                let champ = await leagueJs.StaticData.gettingChampionById(getMatch.participants[i].championId);
                newMatchHistory.players[i].champion = champ.name;
                if(getMatch.participants[i].participantId === mainParticipantId[mainParticipantId.length-1]) {

                    let sumSpell1 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell1Id);
                    let sumSpell2 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell2Id);
                    let keystone = await leagueJs.StaticData.gettingReforgedRuneById(getMatch.participants[i].stats.perk0);
                    let runePath = await leagueJs.StaticData.gettingReforgedRunesPathById(getMatch.participants[i].stats.perkPrimaryStyle);

                    for (var j=0; j<=6; j++) {
                        var item = 'item' + j;
                        if (getMatch.participants[i].stats[item] != 0) {
                            let itemData = await leagueJs.StaticData.gettingItemById(getMatch.participants[i].stats[item]);
                            newMatchHistory.items[j] = itemData.name;
                        }
                    }

                    newMatchHistory.champName = champ.name;
                    newMatchHistory.victory = getMatch.participants[i].stats.win;
                    newMatchHistory.champLevel = getMatch.participants[i].stats.champLevel;
                    newMatchHistory.csTotal = getMatch.participants[i].stats.totalMinionsKilled;
                    newMatchHistory.sumSpells.push(sumSpell1.name, sumSpell2.name);
                    newMatchHistory.sumRunes = {'keystone': keystone.name, 'path': runePath.name};

                    var kill = getMatch.participants[i].stats.kills;
                    var death = getMatch.participants[i].stats.deaths;
                    var assist = getMatch.participants[i].stats.assists;
                    var ratio = Math.floor(((kill + assist) / death) * 100) / 100;

                    newMatchHistory.kda = {'kills': kill, 'deaths': death, 'assists': assist, 'ratio': ratio};

                    var csPerMinRounded = Math.floor((newMatchHistory.csTotal / (newMatchHistory.gameLength / 60)) * 10) / 10;
                    newMatchHistory.csPerMin = csPerMinRounded;

                }
            }
            recentMatchHistory.push(newMatchHistory);
        }
        // for(var i=0; i<matches.length; i++) {
        //     console.log(matches[i].participantIdentities);
        // }

        console.log(mainParticipantId);
        for(var i=0; i<matches.length; i++) {
            console.log(recentMatchHistory[i].players);
            console.log(recentMatchHistory[i]);
        }
        
}

module.exports = {
    show
}