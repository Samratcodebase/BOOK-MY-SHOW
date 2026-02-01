const ROLES = Object.freeze({
  USER: "User",
  CLIENT: "Client",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
});

const statusCode = Object.freeze({
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  UNAUTHORISED: 401,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  CONFLICT: 409,
});

const bookingStatus = Object.freeze({
  IN_PROCESS: "IN_PROCESS",
  CANCELED: "CANCELED",
  SUCCESSFUL: "SUCCESSFUL",
});

const paymentStatus = Object.freeze({
  PENDING: "PENDING",
  FAILED: "FAILED",
  SUCESS: "SUCCESS",
});
export { ROLES, statusCode, bookingStatus, paymentStatus };
