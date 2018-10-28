var LeagueJs = require('../node_modules/leaguejs/lib/LeagueJS');
var matchDetails = require ('../models/matchInfo');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY, {PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID});
const DataDragonHelper = require('../node_modules/leaguejs/lib/DataDragon/DataDragonHelper');
var XRegExp = require('xregexp');
var champList = require('../dragontail-6.24.1/6.24.1/data/en_US/champion.json');
var itemList = require('../dragontail-6.24.1/6.24.1/data/en_US/item.json');
var sumSpellList = require('../dragontail-6.24.1/6.24.1/data/en_US/summoner.json');

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
            var getMatch = await leagueJs.Match.gettingById(match.gameId, region);
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
                // let champ = await leagueJs.StaticData.gettingChampionById(getMatch.participants[i].championId, region);
                var champ = {};
                for(var champion in champList.data) {
                    if(champList.data[champion].key == getMatch.participants[i].championId) {
                        champ = champList.data[champion];
                        break;
                    }
                }
                if(Object.keys(champ).length === 0) {
                    champ = await leagueJs.StaticData.gettingChampionById(getMatch.participants[i].championId, region);
                }
                matchInfo.players[i].champion = champ.name;
                matchInfo.players[i].icon = champ.image.full;
                if (getMatch.participants[i].participantId === mainParticipantId[mainParticipantId.length-1]) {

                    var sumSpell1 = getSumSpell(sumSpellList, getMatch.participants[i].spell1Id);
                    // let sumSpell1 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell1Id, region);
                    var sumSpell2 = getSumSpell(sumSpellList, getMatch.participants[i].spell2Id);
                    // let sumSpell2 = await leagueJs.StaticData.gettingSummonerSpellsById(getMatch.participants[i].spell2Id, region);
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
                            var itemData = {};
                            for(var itemId in itemList.data) {
                                if(itemId == getMatch.participants[i].stats[item]) {
                                    itemData = itemList.data[itemId];
                                    break;
                                }
                            }
                            if(Object.keys(itemData).length === 0) {
                                itemData = await leagueJs.StaticData.gettingItemById(getMatch.participants[i].stats[item], region);
                            }
                            // let itemData = await leagueJs.StaticData.gettingItemById(getMatch.participants[i].stats[item], region);
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

function getSumSpell(json, id) {
    for(var spell in json.data) {
        if(json.data[spell].key == id) {
            return json.data[spell];
        }
    }
    return;
}

module.exports = {
    show
}