// const express = require("express");
// const router = express.Router();
// const { getJobs, createJob,bulkUploadJobs, getJobByTitle, updateJobByTitle, deleteJobByTitle, getJobFormOptions} = require("../controllers/jobController");

// router.get("/", getJobs);

// router.post("/bulk", bulkUploadJobs);
// router.post("/", createJob);
// router.put("/title/:title", updateJobByTitle);
// router.delete("/title/:title", deleteJobByTitle);


// router.get("/title/:title", getJobByTitle);


// router.get("/job-form-options", getJobFormOptions);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  getJobs,
  createJob,
  bulkUploadJobs,
  getJobById,
  updateJobById,
  deleteJobById,
  getJobFormOptions
} = require("../controllers/jobController");

router.get("/", getJobs);

router.get("/job-form-options", getJobFormOptions);

router.post("/bulk", bulkUploadJobs);

router.post("/", createJob);

// KEEP THESE LAST
router.get("/:id", getJobById);

router.put("/:id", updateJobById);

router.delete("/:id", deleteJobById);

module.exports = router;
