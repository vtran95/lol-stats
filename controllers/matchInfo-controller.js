var LeagueJs = require('../node_modules/leaguejs/lib/LeagueJS');
var matchDetails = require ('../models/matchInfo');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY, {PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID});
const DataDragonHelper = require('../node_modules/leaguejs/lib/DataDragon/DataDragonHelper');
var XRegExp = require('xregexp');

async function show(req, res) {
    var regex = new XRegExp("^[0-9\\p{L} _\\.]+$");
    var region = 'na1';
    if (XRegExp.test(req.params.id, regex)) {
        let summoner = await leagueJs.Summoner.gettingByName(req.params.id, region);
        let matchListLong = await leagueJs.Match.gettingRecentListByAccount(summoner.accountId, region);
        var matchList = matchListLong.matches.slice(0,5);
        var matches = [];
        var mainParticipantId = [];
        var matchHistory = new matchDetails.matchHistory;
        matchHistory.name = summoner.name;

        for (const match of matchList) {
            let getMatch = await leagueJs.Match.gettingById(match.gameId, region);
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
                let champ = await leagueJs.StaticData.gettingChampionById(getMatch.participants[i].championId, region);
                // let champ = await DataDragonHelper.gettingChampionsList(getMatch.participants[i].championId);
                matchInfo.players[i].champion = champ.name;
                matchInfo.players[i].icon = champ.image.full;
                if (getMatch.participants[i].participantId === mainParticipantId[mainParticipantId.length-1]) {

                    let sumSpell1 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell1Id, region);
                    let sumSpell2 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell2Id, region);
                    if (getMatch.participants[i].stats.perk0) {
                        var keystone = await leagueJs.StaticData.gettingReforgedRuneById(getMatch.participants[i].stats.perk0, region);
                    } else {
                        var keystone = {name: 'blank'};
                    }
                    if (getMatch.participants[i].stats.perkPrimaryStyle) {
                        var runePath = await leagueJs.StaticData.gettingReforgedRunesPathById(getMatch.participants[i].stats.perkPrimaryStyle, region);
                    } else {
                        var runePath = {name: 'blank'};
                    }

                    for (var j=0; j<=6; j++) {
                        var item = 'item' + j;
                        if (getMatch.participants[i].stats[item] != 0) {
                            let itemData = await leagueJs.StaticData.gettingItemById(getMatch.participants[i].stats[item], region);
                            matchInfo.items[j] = itemData.name;
                        } else {
                            matchInfo.items[j] = 'Empty';
                        }
                    }

                    matchInfo.champName = champ.name;
                    matchInfo.champIcon = champ.image.full;
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
        // console.log(mainParticipantId);
        // for(var i=0; i<matches.length; i++) {
        //     console.log(newMatchHistory.matches[i]);
        // }
        res.status(200).json(newMatchHistory);
    } else {
        res.end();
        return;
    }
}

module.exports = {
    show
}