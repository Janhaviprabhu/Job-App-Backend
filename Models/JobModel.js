const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
    company: { type: String, required: true },
    location: { type: String, required: true },
    contract: { type: String, required: true },
    position: { type: String, required: true },
});

const JobModel = mongoose.model("jobs", jobSchema);

module.exports = JobModel;