var mongoose = require("mongoose");

var UpdateSchema = new mongoose.Schema({
    shippingnumber: String,
    market: String,
    importer: String,
    feedlot: String,
    abattior: String,
    updatenumber: String,
    updatedtill: Date,
    cowsalive: Number,
    cowsmortal: Number,
    cowsprocessed: Number,
    cowsuntracked: Number,
    cowrfid: {},
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Update", UpdateSchema);
