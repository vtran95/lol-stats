var LeagueJs = require('LeagueJS');const matchInfo = require ('../models/matchInfo');
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
        for (const match of matchList.matches) {
            let getMatch = await leagueJs.Match.gettingById(match.gameId);
            matches.push(getMatch);
        }
        for(var i=0; i<matches.length; i++) {
            console.log(matches[i].participantIdentities);
        }
        var participantId = [];
        matches.forEach(function(match) {
           match.participantIdentities.forEach(function(participant) {
                if(participant.player.summonerName === summoner.name) {
                    participantId.push(participant.participantId);
                }
            })
        })
        console.log(participantId);
        // leagueJs.StaticData.gettingChampionById()
}

module.exports = {
    show
}