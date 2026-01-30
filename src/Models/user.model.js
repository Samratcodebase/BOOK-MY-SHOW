// ===========================
// USER MODEL MODULE
// ===========================
// This module defines the User schema and model with password hashing and authentication methods

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../Utils/constant.js";

/**
 * USER SCHEMA
 * Defines the structure and validation rules for user documents
 */
const UserSchema = new mongoose.Schema(
  {
    // User's display name
    username: {
      type: String,
      required: true,
    },

    // User's email address (unique identifier)
    email: {
      type: String,
      unique: true,
      required: true,
    },

    // User's password (hashed with bcrypt, min 10 chars)
    password: {
      type: String,
      required: true,
      minLength: 10,
    },

    // User's role for access control (USER, CLIENT, ADMIN, MODERATOR)
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    // User account status (APPOVED or other statuses)
    userStatus: {
      type: String,
      required: true,
      default: "APPOVED",
    },
  },
  { timestamps: true }, // Auto-adds createdAt and updatedAt fields
);

/**
 * PRE-SAVE MIDDLEWARE HOOK
 * Hashes password before saving to database using bcrypt
 * Only hashes if password has been modified
 */
UserSchema.pre("save", async function () {
  // Skip hashing if password hasn't been modified
  if (!this.isModified("password")) return;

  // Generate salt for hashing
  const salt = await bcrypt.genSalt(10);
  // Hash password with salt and store
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * COMPARE PASSWORD METHOD
 * Compares a provided password with the hashed password stored in database
 * @param {string} password - Plain text password to compare
 * @returns {Promise<boolean>} True if password matches, false otherwise
 * @throws {Error} If password hash is not present on document
 */
UserSchema.methods.comparePassword = async function (password) {
  // Validate that password hash exists
  if (!this.password) {
    throw new Error("Password hash not present on user document");
  }

  // Compare provided password with stored hash using bcrypt
  return await bcrypt.compare(password, this.password);
};

// Export User model
export default mongoose.model("User", UserSchema);
