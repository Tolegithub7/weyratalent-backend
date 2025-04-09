export enum JobRole {
  SOFTWARE_ENGINEER = "Software Engineer",
  DATA_SCIENTIST = "Data Scientist",
  PRODUCT_MANAGER = "Product Manager",
  DESIGNER = "Designer",
  MARKETING_MANAGER = "Marketing Manager",
  SALES_REPRESENTATIVE = "Sales Representative",
  HR_MANAGER = "HR Manager",
  ACCOUNTANT = "Accountant",
  OTHER = "Other",
}

export enum SalaryType {
  HOURLY = "Hourly",
  FIXED = "Fixed",
}

export enum JobType {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
  CONTRACT = "Contract",
  INTERN = "Internship",
  FREELANCE = "Freelance",
}

export enum JobLevel {
  ENTRY_LEVEL = "Entry Level",
  MID_LEVEL = "Mid Level",
  SENIOR_LEVEL = "Senior Level",
  LEAD = "Lead",
  DIRECTOR = "Director",
  EXECUTIVE = "Executive",
}

export enum Education {
  HighSchool = "High School",
  AssociateDegree = "Associate Degree",
  BachelorDegree = "Bachelor's Degree",
  MasterDegree = "Master's Degree",
  Doctorate = "Doctorate",
  Other = "Other",
}

export enum Vacancies {
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  FivePlus = "5+",
}

export enum Experience {
  EntryLevel = "Entry Level",
  MidLevel = "Mid Level",
  SeniorLevel = "Senior Level",
}

export enum StatusType {
  ACTIVE = "active",
  EXPIRED = "expired",
}

export interface CreateJobPostingDTO {
  id: string;
  userId: string;
  jobTitle: string;
  jobRole?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryType?: SalaryType;
  education?: Education;
  jobType?: JobType;
  experience?: Experience;
  vacancies?: number;
  expiryDate: Date;
  jobLevel?: JobLevel;
  description?: string;
  responsibilities?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
