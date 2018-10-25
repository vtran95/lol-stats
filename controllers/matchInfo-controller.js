var LeagueJs = require('LeagueJS');const matchInfo = require ('../models/matchInfo');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);

function show(req, res) {
    console.log(req.params.id);
    leagueJs.Summoner.gettingByName(req.params.id)
    .then(data => {
        'use strict';
        console.log(data);
    })
    .catch(err => {
        'use strict';
        console.log(err);
    });
    return;
}

module.exports = {
    show
}