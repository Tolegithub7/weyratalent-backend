export enum OrganizationType {
  PRIVATE = "Private",
  GOVERNMENT = "Government",
  NONPROFIT = "Nonprofit",
  COOPERATIVE = "Cooperative",
  INTERNATIONAL = "International",
  OTHER = "other",
}

export enum IndustryType {
  TECHNOLOGY = "Technology",
  HEALTHCARE = "Healthcare",
  FINANCE = "Finance",
  EDUCATION = "Education",
  MANUFACTURING = "Manufacturing",
  RETAIL = "Retail",
  TRANSPORTATION = "Transportation",
  ENERGY = "Energy",
  TELECOMMUNICATIONS = "Telecommunications",
  CONSTRUCTION = "Construction",
  AGRICULTURE = "Agriculture",
  ENTERTAINMENT = "Entertainment",
  REAL_ESTATE = "Real Estate",
  HOSPITALITY = "Hospitality",
  GOVERNMENT = "Government",
  OTHER = "other",
}

export enum TeamSize {
  ONE_TO_TEN = "0-10",
  TEN_TO_FIFTY = "10-50",
  FIFTY_PLUS = "50+",
}
export interface EmployerProfileType {
  id: string;
  userId: string;
  logoUrl?: string;
  bannerUrl: string;
  companyName: string;
  about: string;
  location: string;
  phoneNumber: string;
  email: string;
  organizationType: OrganizationType;
  industryType: IndustryType;
  teamSize: TeamSize;
  yearEstablished: string;
  website: string;
  vision: string;
  instagramLink?: string;
  telegramLink?: string;
  facebookLink?: string;
  xLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEmployerProfileType = Omit<EmployerProfileType, "id" | "userId">;
export type UpdateEmployerProfileType = Partial<EmployerProfileType>;
