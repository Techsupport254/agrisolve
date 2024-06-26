const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
	title: { type: String, required: true },
	event: { type: String, required: true, default: "" }, // Default value changed to an empty string
	description: { type: String, required: true },
	eventDate: { type: String },
	from: { type: String },
	to: { type: String },
	location: { type: String, default: "Online" },
	address: { type: String, default: "Online" },
	link: { type: String, required: true },
	images: { type: Array, required: true },
	fee: { type: Number }, // Changed to Number
	created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("News", NewsSchema);
