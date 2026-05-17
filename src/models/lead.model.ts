import { model, Schema, Types, type HydratedDocument } from "mongoose";
import { leadSources, leadStatuses, type LeadSource, type LeadStatus } from "../types/lead.types";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadDocument = HydratedDocument<ILead>;

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    status: {
      type: String,
      enum: leadStatuses,
      default: "New",
      index: true
    },
    source: {
      type: String,
      enum: leadSources,
      required: true,
      index: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ createdBy: 1, createdAt: -1 });

export const Lead = model<ILead>("Lead", leadSchema);
