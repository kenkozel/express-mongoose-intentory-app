var mongoose = require("mongoose");

var ShipmentSchema = new mongoose.Schema({
    market: String,
    shippingnumber: Number,
    loaddate: Date,
    shipname: String,
    cowsalive: Number,
    cowsprocessed: Number,
    cowsmortal: Number,
    cowsuntracked: Number,
    cowrfid: {},
    createdAt: { type: Date, default: Date.now },
    author: {
    id: {
	type: mongoose.Schema.Types.ObjectId,
                ref: "User"
		},
		username: String
	},
    updates: [
		{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Update"
		}
		]
});

module.exports = mongoose.model("Shipment", ShipmentSchema);
