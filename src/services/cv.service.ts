import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { cv, education, project, workExperience } from "@/entities";
import type { Categories, EducationResponseType, ProjectResponseType, WorkExperienceResponseType } from "@/types";
import type { CVInputType, CVResponseType } from "@/types";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

class CVService {
  async create(cvData: CVInputType, userId: string): Promise<ServiceResponse<CVResponseType | null>> {
    try {
      const { fullName, skillTitle, hourlyRate, categories } = cvData;
      const cvTableData = {
        userId,
        fullName,
        skillTitle,
        hourlyRate,
        categories,
      };
      const createdCv = await db.insert(cv).values(cvTableData).returning();
      const cvId = createdCv[0].id;
      const createdEducation: EducationResponseType[] = [];
      if (cvData.education && cvData.education.length > 0) {
        await Promise.all(
          cvData.education.map(async (edu) => {
            const eduTableData = {
              ...edu,
              cvId,
              start_date: new Date(edu.start_date),
              end_date: edu.end_date ? new Date(edu.end_date) : null,
            };
            const created = await db.insert(education).values(eduTableData).returning();
            const educationData = {
              ...created[0],
              end_date: created[0].end_date ? created[0].end_date.toLocaleDateString() : undefined, // Convert null to undefined
              gpa: edu.gpa ?? undefined,
            };
            createdEducation.push({ ...educationData, start_date: educationData.start_date.toLocaleDateString() });
          }),
        );
      }

      const createdWorkExperience: WorkExperienceResponseType[] = [];
      if (cvData.workExperience && cvData.workExperience.length > 0) {
        await Promise.all(
          cvData.workExperience.map(async (work) => {
            const workTableData = {
              ...work,
              cvId,
              start_date: new Date(work.start_date),
              end_date: work.end_date ? new Date(work.end_date) : null,
            };
            const created = await db.insert(workExperience).values(workTableData).returning();
            const workData = {
              ...created[0],
              end_date: created[0].end_date ? created[0].end_date.toLocaleDateString() : undefined, // Convert null to undefined
            };
            createdWorkExperience.push({ ...workData, start_date: workData.start_date.toLocaleDateString() });
          }),
        );
      }

      const createdProjects: ProjectResponseType[] = [];
      if (cvData.project && cvData.project.length > 0) {
        await Promise.all(
          cvData.project.map(async (proj) => {
            const projectTableData = { ...proj, cvId };
            const created = await db.insert(project).values(projectTableData).returning();
            const projectData = {
              ...created[0],
              projectLink: proj.projectLink ?? undefined, // Convert null to undefined
            };
            createdProjects.push(projectData);
          }),
        );
      }

      const serviceResponse: CVResponseType = {
        ...createdCv[0],
        categories: createdCv[0].categories as Categories,
        education: createdEducation,
        project: createdProjects,
        workExperience: createdWorkExperience,
      };

      return ServiceResponse.success<CVResponseType>(
        "CV created Succesfully",
        serviceResponse as unknown as CVResponseType,
        StatusCodes.OK,
      );
    } catch (error) {
      console.error(error);
      return ServiceResponse.failure<null>("failed to create cv", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCvs(): Promise<ServiceResponse<CVResponseType[] | null>> {
    try {
      const cvs = await db.select().from(cv);
      const allCvs: CVResponseType[] = [];
      await Promise.all(
        cvs.map(async (cv) => {
          const cvId = cv.id;
          const workData = (await db.select().from(workExperience).where(eq(workExperience.cvId, cvId))).map(
            (work) => ({
              ...work,
              end_date: work.end_date ? work.end_date.toLocaleDateString() : undefined, // Convert null to undefined
              start_date: work.start_date.toLocaleDateString(),
            }),
          );
          const projectData = (await db.select().from(project).where(eq(project.cvId, cvId))).map((proj) => ({
            ...proj,
            projectLink: proj.projectLink ?? undefined, // Convert null to undefined
          }));
          const educationData = (await db.select().from(education).where(eq(education.cvId, cvId))).map((edu) => ({
            ...edu,
            end_date: edu.end_date ? edu.end_date.toLocaleDateString() : undefined, // Convert null to undefined
            start_date: edu.start_date.toLocaleDateString(),
            gpa: edu.gpa ?? undefined,
          }));

          allCvs.push({
            ...cv,
            categories: cv.categories as Categories,
            workExperience: workData,
            project: projectData,
            education: educationData,
          });
        }),
      );

      return ServiceResponse.success<CVResponseType[]>(
        "CVs fetched Succesfully",
        allCvs as unknown as CVResponseType[],
        StatusCodes.OK,
      );
    } catch (error) {
      console.error(error);
      return ServiceResponse.failure<null>("failed to get all cvs", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getCv(id: string): Promise<ServiceResponse<CVResponseType | null>> {
    try {
      const cvData = await db.select().from(cv).where(eq(cv.id, id));
      const foundCv = cvData ? cvData[0] : null;
      if (foundCv) {
        const cvId = foundCv.id;
        const workData = (await db.select().from(workExperience).where(eq(workExperience.cvId, cvId))).map((work) => ({
          ...work,
          end_date: work.end_date ?? undefined, // Convert null to undefined
        }));
        const projectData = (await db.select().from(project).where(eq(project.cvId, cvId))).map((proj) => ({
          ...proj,
          projectLink: proj.projectLink ?? undefined, // Convert null to undefined
        }));
        const educationData = (await db.select().from(education).where(eq(education.cvId, cvId))).map((edu) => ({
          ...edu,
          end_date: edu.end_date ?? undefined, // Convert null to undefined
          gpa: edu.gpa ?? undefined,
        }));

        const serviceResponse = {
          ...foundCv,
          categories: foundCv.categories as Categories,
          workExperience: workData,
          project: projectData,
          education: educationData,
        };
        return ServiceResponse.success<CVResponseType>(
          "CV fetched Succesfully",
          serviceResponse as unknown as CVResponseType,
          StatusCodes.OK,
        );
      }

      return ServiceResponse.success<CVResponseType>(
        "CV fetched Succesfully",
        {} as unknown as CVResponseType,
        StatusCodes.OK,
      );
    } catch (error) {
      console.error(error);
      return ServiceResponse.failure<null>("failed to get all cv", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCv(id: string): Promise<ServiceResponse<null>> {
    try {
      const cvData = await db.select().from(cv).where(eq(cv.id, id));
      const foundCv = cvData ? cvData[0] : null;

      if (foundCv) {
        const cvId = foundCv.id;
        await db.delete(workExperience).where(eq(workExperience.cvId, cvId)).returning();
        await db.delete(project).where(eq(project.cvId, cvId)).returning();
        await db.delete(education).where(eq(education.cvId, cvId)).returning();
      }

      await db.delete(cv).where(eq(cv.id, id)).returning();

      return ServiceResponse.success<null>("CV deleted Succesfully", null, StatusCodes.OK);
    } catch (error) {
      console.error(error);
      return ServiceResponse.failure<null>("failed deleting all cv", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCv(id: string, updateData: CVInputType): Promise<ServiceResponse<null>> {
    try {
      //To be implemented == = ========

      return ServiceResponse.success<null>("CV updated Succesfully", null, StatusCodes.OK);
    } catch (error) {
      console.error(error);
      return ServiceResponse.failure<null>("failed updating", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const cvService = new CVService();
