import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeResumeUpdate } from "../controllers/resumeController.js";

test("accepts supported top-level resume fields", () => {
  assert.deepEqual(
    sanitizeResumeUpdate({ title: "Engineer Resume", public: true, userId: "attacker", $set: { public: false } }),
    { title: "Engineer Resume", public: true }
  );
});

test("filters unsupported nested personal information fields", () => {
  assert.deepEqual(
    sanitizeResumeUpdate({
      personal_info: {
        full_name: "Aparna Singh",
        email: "aparna@example.com",
        userId: "attacker",
        password: "not-allowed"
      }
    }),
    { personal_info: { full_name: "Aparna Singh", email: "aparna@example.com" } }
  );
});

test("filters unsupported fields from experience entries", () => {
  assert.deepEqual(
    sanitizeResumeUpdate({
      experience: [{ company: "Example Ltd", position: "Developer", userId: "attacker" }]
    }),
    { experience: [{ company: "Example Ltd", position: "Developer" }] }
  );
});

test("rejects non-object payloads", () => {
  assert.throws(() => sanitizeResumeUpdate(null), /JSON object/);
  assert.throws(() => sanitizeResumeUpdate([]), /JSON object/);
});

test("rejects malformed nested collections", () => {
  assert.throws(() => sanitizeResumeUpdate({ experience: "not-an-array" }), /must be an array/);
  assert.throws(() => sanitizeResumeUpdate({ experience: [null] }), /must be an object/);
});
