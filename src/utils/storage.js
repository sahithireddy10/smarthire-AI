// src/utils/storage.js
// Generic CRUD for all four collections
// Keys: smarthire_students | smarthire_companies | smarthire_drives | smarthire_applications

export const getAll = (key) => JSON.parse(localStorage.getItem(key) || "[]");
export const setAll = (key, data) => localStorage.setItem(key, JSON.stringify(data));
export const getById = (key, id) => getAll(key).find(x => x.id === id);
export const addItem = (key, item) => setAll(key, [...getAll(key), item]);
export const updateItem = (key, id, updates) =>
  setAll(key, getAll(key).map(x => x.id === id ? { ...x, ...updates } : x));
export const deleteItem = (key, id) =>
  setAll(key, getAll(key).filter(x => x.id !== id));

// Convenience named exports
export const getStudents = () => getAll("smarthire_students");
export const getCompanies = () => getAll("smarthire_companies");
export const getDrives = () => getAll("smarthire_drives");
export const getApplications = () => getAll("smarthire_applications");
