import { StatusCodes } from "http-status-codes";
import { Job } from "../../../DB/models/job.model.js";
import { Company } from "../../../DB/models/company.model.js";
import { Application } from "../../../DB/models/application.model.js";
import cloudinary from "../../utils/cloud.js";

export const addJob = async (req, res, next) => {
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId } = req.body;


  const job = await Job.create({
    jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, company: companyId, addedBy: req.user._id,

  });
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "job add successfully  " });
};



export const updateJob = async (req, res, next) => {
  const { jobId } = req.params
  const userId = req.user._id;
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId } = req.body;

  const job = await Job.findById({ _id: jobId });

  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "job not found ",
    });
  }


  const jobUpdate = await Job.findOneAndUpdate(
    { _id: jobId, addedBy: userId },
    { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, company: companyId },
    { new: true }
  );
  return res ? res.status(StatusCodes.OK)
    .json({
      success: true, message: "job updated successfully", data: jobUpdate,
    }) : res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Unauthorized: You are not the owner of this job.",
    });


};

export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params
  const userId = req.user._id;
  const noteExist = await Job.findOneAndDelete({ _id: jobId, addedBy: userId });
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "job deleted successfully",
    data: noteExist,
  })

};

export const getWithCompanyInfo = async (req, res, next) => {

  const jobs = await Job.find().populate('company');

  return res.status(StatusCodes.OK).json({
    success: true,
    data: jobs,
  })

}



export const getAllJobsForCompany = async (req, res, next) => {
  const { companyName } = req.query

  const company = await Company.findOne({ companyName })
  if (!company) {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Company not found' });
  }
  const jobs = await Job.find({ company: company._id });


  return res.status(StatusCodes.OK).json({
    success: true,
    data: jobs,
  })

}
export const getJobsWithFilters = async (req, res, next) => {

  const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
  const filters = {};

  if (workingTime) {
    filters.workingTime = workingTime;
  }
  if (jobLocation) {
    filters.jobLocation = jobLocation;
  }
  if (seniorityLevel) {
    filters.seniorityLevel = seniorityLevel;
  }
  if (jobTitle) {
    filters.jobTitle = { $regex: new RegExp(jobTitle, 'i') };
  }
  if (technicalSkills) {
    filters.technicalSkills = { $in: technicalSkills.split(',') };
  }
  console.log(filters)
  const jobs = await Job.find(filters);
  return res.status(StatusCodes.OK).json({ success: true, jobs });

};




export const applyToJob = async (req, res) => {
  const { jobId, userTechSkills, userSoftSkills } = req.body;
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path)
  console.log(req.body)
  const application = await Application.create({
    jobId, userTechSkills, userSoftSkills, userResume: { secure_url, public_id }, userId: req.user._id
  });
  res.status(201).json({ success: true, message: 'Application submitted successfully', application });
};


