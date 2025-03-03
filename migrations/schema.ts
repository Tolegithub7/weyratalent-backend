import { pgTable, unique, uuid, text, varchar, date, timestamp, check, boolean, foreignKey, integer, doublePrecision, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const applicationStatus = pgEnum("application_status", ['pending', 'hired', 'interviewing', 'rejected', 'withdrawn'])
export const categories = pgEnum("categories", ['frontend', 'backend', 'graphics design', 'fullstack', 'devops', 'game', 'machine learning', 'AI', 'mobile'])
export const country = pgEnum("country", ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cape Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'])
export const experience = pgEnum("experience", ['Entry Level', 'Mid Level', 'Senior Level'])
export const gender = pgEnum("gender", ['male', 'female'])
export const industryType = pgEnum("industry_type", ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Transportation', 'Energy', 'Telecommunications', 'Construction', 'Agriculture', 'Entertainment', 'Real Estate', 'Hospitality', 'Government', 'other'])
export const jobLevel = pgEnum("job_level", ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Director', 'Executive'])
export const jobRole = pgEnum("job_role", ['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer', 'Marketing Manager', 'Sales Representative', 'HR Manager', 'Accountant', 'Other'])
export const jobType = pgEnum("job_type", ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'])
export const nationality = pgEnum("nationality", ['Algerian', 'Angolan', 'Beninese', 'Botswanan', 'Burkinabé', 'Burundian', 'Cape Verdean', 'Cameroonian', 'Central African', 'Chadian', 'Comoran', 'Congolese', 'Djiboutian', 'Egyptian', 'Equatorial Guinean', 'Eritrean', 'Swazi', 'Ethiopian', 'Gabonese', 'Gambian', 'Ghanaian', 'Guinean', 'Bissau-Guinean', 'Ivorian', 'Kenyan', 'Basotho', 'Liberian', 'Libyan', 'Malagasy', 'Malawian', 'Malian', 'Mauritanian', 'Mauritian', 'Moroccan', 'Mozambican', 'Namibian', 'Nigerien', 'Nigerian', 'Rwandan', 'Santomean', 'Senegalese', 'Seychellois', 'Sierra Leonean', 'Somali', 'South African', 'South Sudanese', 'Sudanese', 'Tanzanian', 'Togolese', 'Tunisian', 'Ugandan', 'Zambian', 'Zimbabwean'])
export const organizationType = pgEnum("organization_type", ['Private', 'Government', 'Nonprofit', 'Cooperative', 'International', 'other'])
export const role = pgEnum("role", ['admin', 'talent', 'recruiter'])
export const salaryType = pgEnum("salary_type", ['Hourly', 'fixed'])
export const status = pgEnum("status", ['active', 'expired'])
export const teamSize = pgEnum("team_size", ['0-10', '10-50', '50+'])
export const tokenType = pgEnum("token_type", ['access', 'refresh'])
export const vacancies = pgEnum("vacancies", ['1', '2', '3', '4', '5+'])


export const talentProfile = pgTable("talent_profile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	profileUrl: text("profile_url"),
	fullName: text("full_name").notNull(),
	userId: uuid("user_id").notNull(),
	country: country().notNull(),
	personalWebsite: varchar("personal_website", { length: 255 }),
	about: text(),
	nationality: nationality().notNull(),
	dob: date().notNull(),
	gender: gender().notNull(),
	experience: experience().notNull(),
	socialLink: varchar("social_link", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("talent_profile_user_id_unique").on(table.userId),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: text("full_name"),
	email: varchar({ length: 50 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 15 }),
	password: text().notNull(),
	role: role().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	userName: varchar("user_name", { length: 50 }),
	country: varchar({ length: 50 }).notNull(),
	companyName: varchar("company_name", { length: 100 }),
	address: text(),
	verifiedLicense: text("verified_license"),
	agreeTermsService: boolean("agree_terms_service").default(false).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_user_name_unique").on(table.userName),
	check("phone_number_length_check", sql`((length((phone_number)::text) >= 10) AND (length((phone_number)::text) <= 15)) AND ((phone_number)::text ~ '^[+]?[0-9]+$'::text)`),
]);

export const cv = pgTable("cv", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	userId: uuid("user_id").notNull(),
	skillTitle: text("skill_title").notNull(),
	hourlyRate: integer("hourly_rate").default(0).notNull(),
	categories: categories().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "cv_user_id_users_id_fk"
		}),
	unique("cv_user_id_unique").on(table.userId),
	check("hourly_rate_check", sql`(hourly_rate >= 0) AND (hourly_rate <= 100)`),
]);

export const favoriteJobs = pgTable("favorite_jobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	jobProfileId: uuid("job_profile_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "favorite_jobs_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.jobProfileId],
			foreignColumns: [jobPosting.id],
			name: "favorite_jobs_job_profile_id_job_posting_id_fk"
		}),
]);

export const organizationInfo = pgTable("organization_info", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	organizationType: organizationType("organization_type").notNull(),
	industryType: industryType("industry_type").notNull(),
	teamSize: teamSize("team_size").notNull(),
	companyVision: varchar("company_vision", { length: 500 }),
	instagramLink: varchar("instagram_link", { length: 50 }),
	telegramLink: varchar("telegram_link", { length: 50 }),
	facebookLink: varchar("facebook_link", { length: 50 }),
	xLink: varchar("X_link", { length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "organization_info_user_id_users_id_fk"
		}),
	unique("organization_info_user_id_unique").on(table.userId),
]);

export const education = pgTable("education", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cvId: uuid("cv_id").notNull(),
	degree: varchar({ length: 255 }).notNull(),
	institution: varchar({ length: 255 }).notNull(),
	gpa: doublePrecision(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.cvId],
			foreignColumns: [cv.id],
			name: "education_cv_id_cv_id_fk"
		}),
	check("gpa_check", sql`(gpa >= (0)::double precision) AND (gpa <= (4)::double precision)`),
]);

export const project = pgTable("project", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cvId: uuid("cv_id").notNull(),
	description: text().notNull(),
	projectLink: varchar("project_link", { length: 55 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	title: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cvId],
			foreignColumns: [cv.id],
			name: "project_cv_id_cv_id_fk"
		}),
]);

export const workExperience = pgTable("work_experience", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cvId: uuid("cv_id").notNull(),
	jobTitle: varchar("job_title", { length: 50 }).notNull(),
	company: varchar({ length: 55 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.cvId],
			foreignColumns: [cv.id],
			name: "work_experience_cv_id_cv_id_fk"
		}),
]);

export const jobPosting = pgTable("job_posting", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	jobTitle: varchar("job_title", { length: 50 }),
	jobRole: jobRole("job_role").notNull(),
	jobType: jobType("job_type").notNull(),
	jobLevel: jobLevel("job_level").notNull(),
	salaryType: salaryType("salary_type").notNull(),
	vacancies: vacancies().notNull(),
	description: text().notNull(),
	responsibilities: text().notNull(),
	minSalary: doublePrecision("min_salary").default(0),
	maxSalary: doublePrecision("max_salary").default(0).notNull(),
	expiryDate: timestamp("expiry_date", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	status: status().default('active').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "job_posting_user_id_users_id_fk"
		}),
	unique("job_posting_user_id_unique").on(table.userId),
]);

export const appliedJobs = pgTable("applied_jobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	jobProfileId: uuid("job_profile_id").notNull(),
	applicationStatus: applicationStatus("application_status").default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "applied_jobs_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.jobProfileId],
			foreignColumns: [jobPosting.id],
			name: "applied_jobs_job_profile_id_job_posting_id_fk"
		}),
]);

export const employerProfile = pgTable("employer_profile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	logoUrl: varchar("logo_url", { length: 255 }),
	bannerUrl: varchar("banner_url", { length: 255 }).notNull(),
	companyName: varchar("company_name", { length: 100 }).notNull(),
	about: text().notNull(),
	location: varchar({ length: 100 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	organizationType: organizationType("organization_type").notNull(),
	industryType: industryType("industry_type").notNull(),
	teamSize: teamSize("team_size").notNull(),
	yearEstablished: varchar("year_established", { length: 4 }).notNull(),
	website: varchar({ length: 255 }).notNull(),
	vision: text().notNull(),
	instagramLink: varchar("instagram_link", { length: 50 }),
	telegramLink: varchar("telegram_link", { length: 50 }),
	facebookLink: varchar("facebook_link", { length: 50 }),
	xLink: varchar("X_link", { length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "employer_profile_user_id_users_id_fk"
		}),
	unique("employer_profile_user_id_unique").on(table.userId),
	unique("employer_profile_email_unique").on(table.email),
]);

export const token = pgTable("token", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	token: text().notNull(),
	userId: uuid("user_id").notNull(),
	tokenType: tokenType("token_type").notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "token_user_id_users_id_fk"
		}),
]);
