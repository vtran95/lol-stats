var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchInfoSchema = new Schema({
    actId: Number,
    champLevel: Number,
    champName: String,
    csPerMin: Number,
    csTotal: Number,
    gameLength: Number,
    items: [String],
    kda: {kills: Number, deaths: Number, assists: Number, ratio: Number},
    players:[{playerId: Number, name: String, champion: String}],
    sumName: String,
    sumRunes: {keystone: String, path: String},
    sumSpells: [String],
    victory: Boolean
}, {
    timestamps: true
});

var matchInfo = mongoose.model('MatchInfo', matchInfoSchema);

var matchHistorySchema = new Schema({
    name: String,
    matches: [matchInfoSchema]
})

var matchHistory = mongoose.model('MatchHistory', matchHistorySchema);

module.exports = {
    matchInfo,
    matchHistory
}