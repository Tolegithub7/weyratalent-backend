import { relations } from "drizzle-orm/relations";
import { users, cv, favoriteJobs, jobPosting, organizationInfo, education, project, workExperience, appliedJobs, employerProfile, token } from "./schema";

export const cvRelations = relations(cv, ({one, many}) => ({
	user: one(users, {
		fields: [cv.userId],
		references: [users.id]
	}),
	educations: many(education),
	projects: many(project),
	workExperiences: many(workExperience),
}));

export const usersRelations = relations(users, ({many}) => ({
	cvs: many(cv),
	favoriteJobs: many(favoriteJobs),
	organizationInfos: many(organizationInfo),
	jobPostings: many(jobPosting),
	appliedJobs: many(appliedJobs),
	employerProfiles: many(employerProfile),
	tokens: many(token),
}));

export const favoriteJobsRelations = relations(favoriteJobs, ({one}) => ({
	user: one(users, {
		fields: [favoriteJobs.userId],
		references: [users.id]
	}),
	jobPosting: one(jobPosting, {
		fields: [favoriteJobs.jobProfileId],
		references: [jobPosting.id]
	}),
}));

export const jobPostingRelations = relations(jobPosting, ({one, many}) => ({
	favoriteJobs: many(favoriteJobs),
	user: one(users, {
		fields: [jobPosting.userId],
		references: [users.id]
	}),
	appliedJobs: many(appliedJobs),
}));

export const organizationInfoRelations = relations(organizationInfo, ({one}) => ({
	user: one(users, {
		fields: [organizationInfo.userId],
		references: [users.id]
	}),
}));

export const educationRelations = relations(education, ({one}) => ({
	cv: one(cv, {
		fields: [education.cvId],
		references: [cv.id]
	}),
}));

export const projectRelations = relations(project, ({one}) => ({
	cv: one(cv, {
		fields: [project.cvId],
		references: [cv.id]
	}),
}));

export const workExperienceRelations = relations(workExperience, ({one}) => ({
	cv: one(cv, {
		fields: [workExperience.cvId],
		references: [cv.id]
	}),
}));

export const appliedJobsRelations = relations(appliedJobs, ({one}) => ({
	user: one(users, {
		fields: [appliedJobs.userId],
		references: [users.id]
	}),
	jobPosting: one(jobPosting, {
		fields: [appliedJobs.jobProfileId],
		references: [jobPosting.id]
	}),
}));

export const employerProfileRelations = relations(employerProfile, ({one}) => ({
	user: one(users, {
		fields: [employerProfile.userId],
		references: [users.id]
	}),
}));

export const tokenRelations = relations(token, ({one}) => ({
	user: one(users, {
		fields: [token.userId],
		references: [users.id]
	}),
}));