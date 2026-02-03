const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },

  // Frontend 'Eligibility' filter kosam
  category: { 
    type: String, 
    enum: ['OPT', 'STEM OPT', 'Non-OPT'], 
    required: true 
  },
  // Frontend 'Workspace' filter kosam
  workspace: { 
    type: String, 
    enum: ['Chicago', 'Remote', 'Hybrid', 'On-site',], 
    required: true 
  },
  employmentType: { 
    type: String, 
    enum: ['F-1 OPT', 'F-1 STEM OPT', 'Full-time'], 
    required: true 
  },
 
  roleOverview: { type: String, required: true },
  keyResponsibilities: [{ type: String }], 
  requiredQualifications: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);