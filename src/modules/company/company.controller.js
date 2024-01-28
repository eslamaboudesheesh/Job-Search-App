import { StatusCodes } from "http-status-codes";
import { Company } from "../../../DB/models/company.model.js";
import { Job } from "../../../DB/models/job.model.js";

export const addCompany = async (req, res, next) => {
  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

  // hash password  8 or 10 to bes secure and good performance
  const company = await Company.create({
    companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR: req.user._id
  });
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "company add successfully  " });
};



export const updateCompany = async (req, res, next) => {
  const { companyId } = req.params
  const userId = req.user._id;
  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

  const company = await Company.findById({ _id: companyId });

  if (!company) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Company not found ",
    });
  }

  // Check if updated email conflicts with existing data
  if (companyEmail && (await Company.exists({ companyEmail: companyEmail }))) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "company Email is already in use.",
    });
  }

  // Check if updated mobile number conflicts with existing data
  if (companyName && (await Company.exists({ companyName: companyName }))) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "company Name is already in use.",
    });
  }

  const companyUpdate = await Company.findOneAndUpdate(
    { _id: companyId, companyHR: userId },
    { companyName, description, industry, address, numberOfEmployees, companyEmail },
    { new: true }
  );
  return res ? res.status(StatusCodes.OK)
    .json({
      success: true, message: "company updated successfully", data: companyUpdate,
    }) : res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Unauthorized: You are not the owner of this company.",
    });


};

export const deleteCompany = async (req, res, next) => {
  const { companyId } = req.params
  const userId = req.user._id;
  const noteExist = await Company.findOneAndDelete({ _id: companyId, companyHR: userId });
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "company deleted successfully",
    data: noteExist,
  })

};



export const getData = async (req, res, next) => {
  const { id } = req.params;
  const company = await Company.findById({ _id: id });
  if (!company) {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Company not found' });
  }

  const jobs = await Job.find({ addedBy: company.companyHR });

  return res.status(StatusCodes.OK).json({ success: true, data: jobs });
};

export const getDataByName = async (req, res, next) => {
  const { name } = req.query;

  const company = await Company.findOne({ companyName: name });
  if (!company) {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Company not found' });
  }

  return res.status(StatusCodes.OK).json({ success: true, data: company });
};
