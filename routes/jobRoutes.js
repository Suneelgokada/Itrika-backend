const express = require("express");
const router = express.Router();
const { getJobs, createJob,bulkUploadJobs, getJobByTitle, updateJobByTitle, deleteJobByTitle, getJobFormOptions} = require("../controllers/jobController");

router.get("/", getJobs);

router.post("/bulk", bulkUploadJobs);
router.post("/", createJob);
router.put("/title/:title", updateJobByTitle);
router.delete("/title/:title", deleteJobByTitle);


router.get("/title/:title", getJobByTitle);


router.get("/job-form-options", getJobFormOptions);

module.exports = router;