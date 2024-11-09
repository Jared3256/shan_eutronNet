const mongoose = require("mongoose");

const projectCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    title: String,
    tags: [String],
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectCategoryModel = mongoose.model(
  "ProjectCategory",
  projectCategorySchema
);
module.exports = ProjectCategoryModel;
