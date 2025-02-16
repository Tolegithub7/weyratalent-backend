import { cvRegistry, talentProfileRegistry } from "@/routes";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([talentProfileRegistry, cvRegistry]);
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
    // add bearerAuth to security for every path except /health-check
    security: [{ bearerAuth: [] }],
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
