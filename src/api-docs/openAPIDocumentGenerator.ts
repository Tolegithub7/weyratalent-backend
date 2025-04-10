import {
  appliedJobsRegistry,
  authRegistry,
  cvRegistry,
  employerProfileRegistry,
  favoriteJobsRegistery,
  jobPostingRegistry,
  logoutRegistry,
  talentProfileRegistry,
  userRegistry,
} from "@/routes";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    talentProfileRegistry,
    employerProfileRegistry,
    jobPostingRegistry,
    cvRegistry,
    userRegistry,
    authRegistry,
    appliedJobsRegistry,
    favoriteJobsRegistery,
    logoutRegistry,
  ]);

  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
  });
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Weyra-Talent Backend API",
      description: "API Documentation for Weyra-Talent Backend API",
    },
    security: [{ bearerAuth: [] }],
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
