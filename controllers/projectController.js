const Builder = require("../models/Builder");
const Project = require("../models/Project");
const Review = require("../models/Review");

const addProject = async (req, res) => {
  req.body.builderId = req.params.builderId;
  const builder = await Builder.findById(req.body.builderId);
  if (!builder) {
    throw Error("Builder not found");
  }
  const project = await Project.create(req.body);

  await Builder.updateOne(
    { _id: req.body.builderId },
    { $addToSet: { projects: project._id } }
  );
  return res.status(200).json(project);
};

const addTags = async (req, res) => {
  const { tags } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.projectId,
    {
      $addToSet: { tags },
    },
    { new: true }
  );
  return res.status(200).json(project);
};

const addImage = async (req, res) => {
  if (!req.file) {
    throw Error("No files were uploaded.");
  }
  const imageUrl = `${process.env.BASE_URL}/${req.file?.path}`;
  const projectId = req.params.projectId;
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { images: { url: imageUrl } } },
    {
      new: true,
    }
  );
  return res.status(200).json(project);
};

const addAnemities = async (req, res) => {
  const { amenitiesList } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.projectId,
    {
      $addToSet: { amenitiesList },
    },
    { new: true }
  );
  return res.status(200).json(project);
};
const addHighlights = async (req, res) => {
  const { highlights } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.projectId,
    {
      $addToSet: { highlights },
    },
    { new: true }
  );
  return res.status(200).json(project);
};

const updateProject = async (req, res) => {
  const projectId = req.params.projectId;
  const project = await Project.findByIdAndUpdate(projectId, req.body, {
    new: true,
  });
  return res.status(200).json(project);
};
const deleteProject = async (req, res) => {
  const projectId = req.params.projectId;
  const project = await Project.findByIdAndDelete(projectId);
  return res.status(200).json(project);
};

const projectReview = async (req, res) => {
  const { title, rating, review } = req.body;
  const projectId = req.params.projectId;

  const project = await Project.findById(projectId);

  if (!project) {
    throw Error("Project not found");
  }

  const createReview = await Review.create({
    userId: req.user._id,
    rating,
    title,
    review,
    reviewOn: "Project",
  });

  await project.updateOne({ $addToSet: { reviews: createReview._id } });
  return res.status(200).json(createReview);
};

const getProjectReviews = async (req, res) => {
  const reviews = await Review.find({ permission: true, reviewOn: "Project" });
  return res.status(200).json(reviews);
};

const getProject = async (req, res) => {
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);

  if (!project) {
    throw Error("Project not found");
  }

  await project.populate("properties");
  await project.populate("reviews");

  return res.status(200).json(project);
};

const getAllProjects = async (req, res) => {
  const projects = await Project.find();
  return res.status(200).json(projects);
};
module.exports = {
  addProject,
  updateProject,
  deleteProject,
  addTags,
  addImage,
  addAnemities,
  addHighlights,
  projectReview,
  getProjectReviews,
  getProject,
  getAllProjects,
};
