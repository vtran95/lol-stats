var LeagueJs = require('LeagueJS');
var matchDetails = require ('../models/matchInfo');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);
var XRegExp = require('xregexp');

async function show(req, res) {
    var regex = new XRegExp("^[0-9\\p{L} _\\.]+$");
    if (XRegExp.test(req.params.id, regex)) {
        let summoner = await leagueJs.Summoner.gettingByName(req.params.id);
        let matchList = await leagueJs.Match.gettingRecentListByAccount(summoner.accountId);
        var matches = [];
        var mainParticipantId = [];
        var matchHistory = new matchDetails.matchHistory;
        matchHistory.name = summoner.name;

        for (const match of matchList.matches) {
            let getMatch = await leagueJs.Match.gettingById(match.gameId);
            matches.push(getMatch);

            var matchInfo = new matchDetails.matchInfo;
            matchInfo.sumName = summoner.name;
            matchInfo.gameLength = getMatch.gameDuration;

            getMatch.participantIdentities.forEach(function(participant) {
                if(participant.player.summonerName === summoner.name) {
                    mainParticipantId.push(participant.participantId);
                }
                matchInfo.players.push({playerId: participant.participantId , name: participant.player.summonerName});
            })
            for (var i = 0; i < getMatch.participants.length; i++) {
                let champ = await leagueJs.StaticData.gettingChampionById(getMatch.participants[i].championId);
                matchInfo.players[i].champion = champ.name;
                if (getMatch.participants[i].participantId === mainParticipantId[mainParticipantId.length-1]) {

                    let sumSpell1 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell1Id);
                    let sumSpell2 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell2Id);
                    if (getMatch.participants[i].stats.perk0) {
                        var keystone = await leagueJs.StaticData.gettingReforgedRuneById(getMatch.participants[i].stats.perk0);
                    } else {
                        var keystone = {name: 'blank'};
                    }
                    if (getMatch.participants[i].stats.perkPrimaryStyle) {
                        var runePath = await leagueJs.StaticData.gettingReforgedRunesPathById(getMatch.participants[i].stats.perkPrimaryStyle);
                    } else {
                        var runePath = {name: 'blank'};
                    }

                    for (var j=0; j<=6; j++) {
                        var item = 'item' + j;
                        if (getMatch.participants[i].stats[item] != 0) {
                            let itemData = await leagueJs.StaticData.gettingItemById(getMatch.participants[i].stats[item]);
                            matchInfo.items[j] = itemData.name;
                        }
                    }

                    matchInfo.champName = champ.name;
                    matchInfo.victory = getMatch.participants[i].stats.win;
                    matchInfo.champLevel = getMatch.participants[i].stats.champLevel;
                    matchInfo.csTotal = getMatch.participants[i].stats.totalMinionsKilled;
                    matchInfo.sumSpells.push(sumSpell1.name, sumSpell2.name);
                    matchInfo.sumRunes = {'keystone': keystone.name, 'path': runePath.name};

                    var kill = getMatch.participants[i].stats.kills;
                    var death = getMatch.participants[i].stats.deaths;
                    var assist = getMatch.participants[i].stats.assists;

                    if ((kill + assist) == 0) {
                        var ratio = 0;
                    } else if (death == 0) {
                        var ratio = kill + assist;
                    } else {
                        var ratio = Math.floor(((kill + assist) / death) * 100) / 100;
                    }

                    matchInfo.kda = {'kills': kill, 'deaths': death, 'assists': assist, 'ratio': ratio};

                    var csPerMinRounded = Math.floor((matchInfo.csTotal / (matchInfo.gameLength / 60)) * 10) / 10;
                    matchInfo.csPerMin = csPerMinRounded;

                }
            }
            let newMatchInfo = await matchInfo.save();
            matchHistory.matches.push(newMatchInfo);
        }

        let newMatchHistory = await matchHistory.save();
        console.log(mainParticipantId);
        for(var i=0; i<matches.length; i++) {
            console.log(newMatchHistory.matches[i]);
        }
        res.status(200).json(newMatchHistory);
    }
}

module.exports = {
    show
}