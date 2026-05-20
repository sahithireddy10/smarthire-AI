// src/data/seed.js

export const SEED_STUDENTS = [];

export const SEED_COMPANIES = [];

export const SEED_DRIVES = [];

export const SEED_APPLICATIONS = [];

export function initSeedData() {
  // Clear any existing seeded data to force a clean slate for the user
  if (!localStorage.getItem("smarthire_db_reset_v2")) {
    localStorage.removeItem("smarthire_students");
    localStorage.removeItem("smarthire_companies");
    localStorage.removeItem("smarthire_drives");
    localStorage.removeItem("smarthire_applications");
    localStorage.setItem("smarthire_db_reset_v2", "true");
  }

  if (!localStorage.getItem("smarthire_students")) {
    localStorage.setItem("smarthire_students", JSON.stringify(SEED_STUDENTS));
  }
  if (!localStorage.getItem("smarthire_companies")) {
    localStorage.setItem("smarthire_companies", JSON.stringify(SEED_COMPANIES));
  }
  if (!localStorage.getItem("smarthire_drives")) {
    localStorage.setItem("smarthire_drives", JSON.stringify(SEED_DRIVES));
  }
  if (!localStorage.getItem("smarthire_applications")) {
    localStorage.setItem("smarthire_applications", JSON.stringify(SEED_APPLICATIONS));
  }
}
