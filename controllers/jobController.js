// const Job = require("../models/Job");

// // 1. All Jobs GET cheyadam (With Pagination, Search & Enhanced Filtering)
// exports.getJobs = async (req, res) => {
//   try {
//     const { category, workspace, location, search, page = 1, limit = 10 } = req.query;

//     // Filtering Logic - Frontend requirements ki match ayyeలా
//     let query = {};
//     if (category && category !== "All Eligibility") query.category = category;
//     if (workspace && workspace !== "All Workspace") query.workspace = workspace;
//     if (location && location !== "All Job Location") {
//         query.location = { $regex: location, $options: "i" };
//     }

//     // Search in Title and Summary/Overview
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { roleOverview: { $regex: search, $options: "i" } },
//       ];
//     }

//     const totalJobs = await Job.countDocuments(query);
//     const jobs = await Job.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     res.status(200).json({
//       jobs,
//       totalPages: Math.ceil(totalJobs / limit),
//       currentPage: Number(page),
//       totalJobs,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // 2. New Job POST cheyadam (Enhanced with Workspace & Category)
// exports.createJob = async (req, res) => {
//   try {
//     const { 
//       title, 
//       category,
//       workspace,    // Remote / Hybrid / On-site
//       employmentType, 
//       roleOverview, 
//       keyResponsibilities, 
//       requiredQualifications,
//     } = req.body;

//     // 1. Strict Validation: Missing okka field unna error vasthundi
//     if (!title || !category || !workspace || !employmentType || !roleOverview || 
//         !keyResponsibilities || !requiredQualifications) {
//       return res.status(400).json({ 
//         message: "All fields are mandatory!",
//         error: "Please ensure Title, Location, Category, Workspace, Type, Overview, Responsibilities, and Qualifications are filled."
//       });
//     }

//     // 2. Deep Duplicate Validation (Title + Location + Category + Workspace)
//     const existingJob = await Job.findOne({ 
//       title: title.trim(), 
//       category: category,
//       workspace: workspace
//     });

//     if (existingJob) {
//       return res.status(409).json({ 
//         message: "Job Already Exists!", 
//         error: `This ${title} role for ${location} has already been posted.` 
//       });
//     }

//     // 3. New Job Creation
//     const newJob = new Job({
//       title: title.trim(),

//       category,
//       workspace,
//       employmentType,
//       roleOverview: roleOverview.trim(),
//       keyResponsibilities, 
//       requiredQualifications,

//     });

//     const savedJob = await newJob.save();
//     res.status(201).json({ message: "Job Posted Successfully", job: savedJob });

//   } catch (err) {
//     res.status(400).json({ message: "Data Validation Error", error: err.message });
//   }
// };

// // 3. Single Job by ID (Don't miss this for Details Page)
// exports.getJobByTitle = async (req, res) => {
//   try {
//     const title = req.params.title;

//     const job = await Job.findOne({
//       title: { $regex: `^${title}$`, $options: "i" }, // case-insensitive
//       isActive: true,
//     });

//     if (!job) {
//       return res.status(404).json({ message: "Job Not Found" });
//       console.log("Title from URL:", req.params.title);

//     }

//     res.status(200).json(job);
//   } catch (err) {
//     console.error("Get job by title error:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// exports.updateJobByTitle = async (req, res) => {
//   try {
//     const { title } = req.params;

//     const updatedJob = await Job.findOneAndUpdate(
//       { title: { $regex: `^${title}$`, $options: "i" } }, 
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );

//     if (!updatedJob) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     res.status(200).json({
//       message: "Job updated successfully",
//       job: updatedJob,
//     });
//   } catch (err) {
//     res.status(400).json({
//       message: "Update failed",
//       error: err.message,
//     });
//   }
// };


// exports.deleteJobByTitle = async (req, res) => {
//   try {
//     const { title } = req.params;

//     const deletedJob = await Job.findOneAndDelete({
//       title: { $regex: `^${title}$`, $options: "i" },
//     });

//     if (!deletedJob) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     res.status(200).json({
//       message: "Job deleted successfully",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Delete failed",
//       error: err.message,
//     });
//   }
// };


// exports.bulkUploadJobs = async (req, res) => {
//   try {
//     const jobsData = req.body;
//     if (!Array.isArray(jobsData) || jobsData.length === 0) {
//       return res.status(400).json({ message: "Please provide an array of jobs." });
//     }
//     const savedJobs = await Job.insertMany(jobsData, { ordered: false });
//     res.status(201).json({
//       message: `${savedJobs.length} jobs uploaded successfully!`,
//       count: savedJobs.length
//     });
//   } catch (err) {
//     res.status(207).json({ 
//       message: "Partial success or bulk upload error", 
//       error: err.message,
//       insertedCount: err.insertedDocs ? err.insertedDocs.length : 0
//     });
//   }
// };



// exports.getJobFormOptions = (req, res) => {
//   res.status(200).json({
//     categories: ['OPT', 'STEM OPT', 'Non-OPT'],
//     workspaces: ['Chicago', 'Remote', 'Hybrid', 'On-site',], 
//     employmentTypes: ['F-1 OPT', 'F-1 STEM OPT', 'Full-time'], 
//   });
// };



// // Normalize title for safe and flexible matching
// const normalizeTitle = (title) => {
//   if (!title) return "";

//   return title
//     .toLowerCase()
//     .replace(/[()]/g, "")        // remove brackets
//     .replace(/\s+/g, " ")        // remove extra spaces
//     .trim();
// };

// // Escape regex special characters
// const escapeRegex = (text) => {
//   return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// };

// // Build safe regex
// const buildTitleRegex = (title) => {
//   const normalized = normalizeTitle(title);
//   const escaped = escapeRegex(normalized);

//   return new RegExp(escaped, "i");
// };


// exports.createJob = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       workspace,
//       employmentType,
//       roleOverview,
//       keyResponsibilities,
//       requiredQualifications,
//     } = req.body;

//     if (
//       !title ||
//       !category ||
//       !workspace ||
//       !employmentType ||
//       !roleOverview ||
//       !keyResponsibilities ||
//       !requiredQualifications
//     ) {
//       return res.status(400).json({
//         message: "All fields are mandatory",
//       });
//     }

//     const normalizedTitle = normalizeTitle(title);

//     const existingJob = await Job.findOne({
//       normalizedTitle,
//       category,
//       workspace,
//     });

//     if (existingJob) {
//       return res.status(409).json({
//         message: "Job already exists",
//       });
//     }

//     const newJob = new Job({
//       title: title.trim(),
//       normalizedTitle, // IMPORTANT FIELD
//       category,
//       workspace,
//       employmentType,
//       roleOverview,
//       keyResponsibilities,
//       requiredQualifications,
//     });

//     const savedJob = await newJob.save();

//     res.status(201).json({
//       message: "Job created successfully",
//       job: savedJob,
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: "Create job failed",
//       error: err.message,
//     });
//   }
// };

// exports.getJobByTitle = async (req, res) => {
//   try {
//     const title = req.params.title;

//     const regex = buildTitleRegex(title);

//     const job = await Job.findOne({
//       normalizedTitle: { $regex: regex },
//       isActive: true,
//     });

//     if (!job) {
//       return res.status(404).json({
//         message: "Job not found",
//       });
//     }

//     res.status(200).json(job);

//   } catch (err) {
//     res.status(500).json({
//       message: "Fetch failed",
//       error: err.message,
//     });
//   }
// };

// exports.updateJobByTitle = async (req, res) => {
//   try {
//     const title = req.params.title;

//     const regex = buildTitleRegex(title);

//     if (req.body.title) {
//       req.body.normalizedTitle = normalizeTitle(req.body.title);
//     }

//     const updatedJob = await Job.findOneAndUpdate(
//       { normalizedTitle: { $regex: regex } },
//       { $set: req.body },
//       { new: true }
//     );

//     if (!updatedJob) {
//       return res.status(404).json({
//         message: "Job not found",
//       });
//     }

//     res.status(200).json({
//       message: "Job updated successfully",
//       job: updatedJob,
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: "Update failed",
//       error: err.message,
//     });
//   }
// };

// exports.deleteJobByTitle = async (req, res) => {
//   try {
//     const title = req.params.title;

//     const regex = buildTitleRegex(title);

//     const deletedJob = await Job.findOneAndDelete({
//       normalizedTitle: { $regex: regex },
//     });

//     if (!deletedJob) {
//       return res.status(404).json({
//         message: "Job not found",
//       });
//     }

//     res.status(200).json({
//       message: "Job deleted successfully",
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: "Delete failed",
//       error: err.message,
//     });
//   }
// };


const Job = require("../models/Job");

const normalizeTitle = (title) => {
  if (!title) return "";

  return title
    .toLowerCase()
    .replace(/[()]/g, "")   
    .replace(/\s+/g, " ")       
    .trim();
};


const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


const buildSafeRegex = (title) => {
  const normalized = normalizeTitle(title);
  const escaped = escapeRegex(normalized);
  return new RegExp(escaped, "i");
};


exports.getJobs = async (req, res) => {
  try {

    const {
      category,
      workspace,
      location,
      search,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    if (category && category !== "All Eligibility") {
      query.category = category;
    }

    if (workspace && workspace !== "All Workspace") {
      query.workspace = workspace;
    }

    if (location && location !== "All Job Location") {
      query.location = { $regex: escapeRegex(location), $options: "i" };
    }

    if (search) {

      const normalizedSearch = normalizeTitle(search);

      query.$or = [
        { normalizedTitle: { $regex: normalizedSearch, $options: "i" } },
        { roleOverview: { $regex: escapeRegex(search), $options: "i" } }
      ];
    }


    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));


    res.status(200).json({
      jobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: Number(page),
      totalJobs
    });

  } catch (err) {

    res.status(500).json({
      message: "Server Error",
      error: err.message
    });

  }
};


exports.createJob = async (req, res) => {

  try {

    const {
      title,
      category,
      workspace,
      employmentType,
      roleOverview,
      keyResponsibilities,
      requiredQualifications
    } = req.body;


    if (
      !title ||
      !category ||
      !workspace ||
      !employmentType ||
      !roleOverview ||
      !keyResponsibilities ||
      !requiredQualifications
    ) {

      return res.status(400).json({
        message: "All fields are mandatory"
      });

    }


    const normalizedTitle = normalizeTitle(title);


    const existingJob = await Job.findOne({
      normalizedTitle,
      category,
      workspace
    });


    if (existingJob) {

      return res.status(409).json({
        message: "Job Already Exists"
      });

    }


    const newJob = new Job({

      title: title.trim(),

      normalizedTitle,

      category,

      workspace,

      employmentType,

      roleOverview: roleOverview.trim(),

      keyResponsibilities,

      requiredQualifications

    });


    const savedJob = await newJob.save();


    res.status(201).json({

      message: "Job Posted Successfully",

      job: savedJob

    });


  } catch (err) {

    res.status(500).json({

      message: "Create Job Failed",

      error: err.message

    });

  }

};


exports.getJobByTitle = async (req, res) => {

  try {

    const title = req.params.title;

    const regex = buildSafeRegex(title);


    const job = await Job.findOne({

      normalizedTitle: { $regex: regex },

      isActive: true

    });


    if (!job) {

      return res.status(404).json({

        message: "Job Not Found"

      });

    }


    res.status(200).json(job);


  } catch (err) {

    res.status(500).json({

      message: "Server Error",

      error: err.message

    });

  }

};


exports.updateJobByTitle = async (req, res) => {

  try {

    const title = req.params.title;

    const regex = buildSafeRegex(title);


    if (req.body.title) {

      req.body.normalizedTitle = normalizeTitle(req.body.title);

    }


    const updatedJob = await Job.findOneAndUpdate(

      {

        normalizedTitle: { $regex: regex }

      },

      {

        $set: req.body

      },

      {

        new: true,

        runValidators: true

      }

    );


    if (!updatedJob) {

      return res.status(404).json({

        message: "Job not found"

      });

    }


    res.status(200).json({

      message: "Job updated successfully",

      job: updatedJob

    });


  } catch (err) {

    res.status(500).json({

      message: "Update failed",

      error: err.message

    });

  }

};


exports.deleteJobByTitle = async (req, res) => {

  try {

    const title = req.params.title;

    const regex = buildSafeRegex(title);


    const deletedJob = await Job.findOneAndDelete({

      normalizedTitle: { $regex: regex }

    });


    if (!deletedJob) {

      return res.status(404).json({

        message: "Job not found"

      });

    }


    res.status(200).json({

      message: "Job deleted successfully"

    });


  } catch (err) {

    res.status(500).json({

      message: "Delete failed",

      error: err.message

    });

  }

};


exports.bulkUploadJobs = async (req, res) => {

  try {

    const jobsData = req.body;

    if (!Array.isArray(jobsData) || jobsData.length === 0) {

      return res.status(400).json({

        message: "Please provide jobs array"

      });

    }


    const processedJobs = jobsData.map(job => ({

      ...job,

      normalizedTitle: normalizeTitle(job.title)

    }));


    const savedJobs = await Job.insertMany(processedJobs, {

      ordered: false

    });


    res.status(201).json({

      message: `${savedJobs.length} jobs uploaded successfully`,

      count: savedJobs.length

    });


  } catch (err) {

    res.status(207).json({

      message: "Bulk upload partially failed",

      error: err.message

    });

  }

};



exports.getJobFormOptions = (req, res) => {

  res.status(200).json({

    categories: ['OPT', 'STEM OPT', 'Non-OPT'],

    workspaces: ['Chicago', 'Remote', 'Hybrid', 'On-site'],

    employmentTypes: ['F-1 OPT', 'F-1 STEM OPT', 'Full-time']

  });

};
