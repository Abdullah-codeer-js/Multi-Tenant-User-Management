const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Multi-Tenant User Management API",
      version: "1.0.0",
      description:
        "API documentation for a multi-tenant user management system with company registration, authentication, role-based access control, and user management.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Companies",
        description: "Company registration and tenant management",
      },
      {
        name: "Authentication",
        description: "User registration, login, and authentication",
      },
      {
        name: "Users",
        description: "User management operations",
      },
      {
        name: "Employees",
        description: "Employee management operations",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },

      schemas: {
        Company: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Capregsoft",
            },
            subdomain: {
              type: "string",
              example: "Caprge",
            },
          },
        },

        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            company_id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Ali Khan",
            },
            email: {
              type: "string",
              format: "email",
              example: "ali@example.com",
            },
            role: {
              type: "string",
              enum: ["Admin", "Manager", "Employee"],
              example: "Employee",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Employee: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            company_id: {
              type: "integer",
              example: 1,
            },
            user_id: {
              type: "integer",
              nullable: true,
              example: 2,
            },
            employee_code: {
              type: "string",
              example: "EMP-001",
            },
            department: {
              type: "string",
              example: "Engineering",
            },
            job_title: {
              type: "string",
              example: "Developer",
            },
            phone: {
              type: "string",
              nullable: true,
              example: "555-0100",
            },
            joining_date: {
              type: "string",
              format: "date",
              example: "2026-10-16",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: [
            "companyName",
            "subdomain",
            "fullName",
            "email",
            "password",
            "passwordConfirmation",
          ],
          properties: {
            companyName: { type: "string", example: "Example Company" },
            subdomain: { type: "string", example: "example-co" },
            fullName: { type: "string", example: "Admin User" },
            email: { type: "string", format: "email", example: "admin@example.com" },
            password: { type: "string", format: "password", minLength: 8, example: "Password123" },
            passwordConfirmation: { type: "string", format: "password", example: "Password123" },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["subdomain", "email", "password"],
          properties: {
            subdomain: { type: "string", example: "example-co" },
            email: { type: "string", format: "email", example: "admin@example.com" },
            password: { type: "string", format: "password", example: "Password123" },
          },
        },

        CreateUserRequest: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", example: "Test Employee" },
            email: { type: "string", format: "email", example: "employee@example.com" },
            password: { type: "string", format: "password", example: "Password123" },
            role: { type: "string", enum: ["Manager", "Employee"], example: "Employee" },
          },
        },

        UpdateUserRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            name: { type: "string", example: "Updated Employee" },
            email: { type: "string", format: "email", example: "employee@example.com" },
            role: { type: "string", enum: ["Manager", "Employee"], example: "Employee" },
          },
        },

        CreateEmployeeRequest: {
          type: "object",
          required: ["user_id", "employee_code", "department", "job_title", "joining_date"],
          properties: {
            user_id: { type: "integer", example: 2 },
            employee_code: { type: "string", example: "EMP-001" },
            department: { type: "string", example: "Engineering" },
            job_title: { type: "string", example: "Developer" },
            phone: { type: "string", nullable: true, example: "555-0100" },
            joining_date: { type: "string", format: "date", example: "2026-10-16" },
          },
        },

        UpdateEmployeeRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            employee_code: { type: "string", example: "EMP-001" },
            department: { type: "string", example: "Engineering" },
            job_title: { type: "string", example: "Senior Developer" },
            phone: { type: "string", nullable: true, example: "555-0100" },
            joining_date: { type: "string", format: "date", example: "2026-10-16" },
          },
        },

        TokenResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful." },
            data: {
              type: "object",
              properties: {
                token: { type: "string", example: "eyJhbGciOi..." },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },

        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: {
              type: "string",
              example: "An error occurred",
            },
            details: {
              type: "object",
              additionalProperties: true,
            },
            stack: {
              type: "string",
              description: "Included only outside production.",
            },
          },
        },

        DataResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {},
          },
        },

        MessageResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Request completed successfully." },
          },
        },
      },
    },
  },

  // swagger-jsdoc scans these files for OpenAPI annotations.
  apis: [
    path.join(__dirname, "../routes/*.js").replace(/\\/g, "/"),
    path.join(__dirname, "../controllers/*.js").replace(/\\/g, "/"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;