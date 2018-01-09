var mongoose = require("mongoose");

var DataSchema = new mongoose.Schema({
    market: String,
    lastname: String,
    shippingnumber: Number,
    loaddate: Date,
    shipname: String,
    importer: String,
    feedlot: String,
    abattior: String,
    updatenumber: String,
    updatedtill: Date,
    cowsalive: Number,
    cowsprocessed: Number,
    cowsmortal: Number,
    cowsuntracked: Number,
    cowrfid: Number
});

module.exports = mongoose.model("Data", DataSchema);
