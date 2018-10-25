var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchInfoSchema = new Schema({
    champLevel: Number,
    champName: String,
    csPerMin: Number,
    csTotal: Number,
    gameLength: Number,
    items: [String],
    kda: [Number],
    sumName: String,
    sumRunes: [String],
    sumSpells: [String],
    victory: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('MatchInfo', matchInfoSchema);