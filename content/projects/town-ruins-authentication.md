# Town Ruins — Authentication and Authorization

The backend implements JWT authentication, password hashing with bcryptjs, role-aware routes, and ownership checks for provider, landlord, tenant, and administrative operations.

## What the artifacts show

- Authentication controllers issue and validate user credentials and tokens.
- Route middleware applies role-aware access checks.
- Domain controllers enforce ownership and administrative boundaries for protected operations.

These claims are grounded in the authentication controller, route middleware, and relevant controllers in the Town Ruins source repository. They describe implemented access-control behavior; they do not claim a security certification or production security outcome.
