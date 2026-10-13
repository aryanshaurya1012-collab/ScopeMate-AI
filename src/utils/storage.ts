import { SavedProject } from '../types/index.ts';

const STORAGE_KEY = 'scopemate_projects_v1';
const STORAGE_VERSION = '1.0.0';

interface StoragePayload {
  version: string;
  updatedAt: string;
  projects: SavedProject[];
}

/**
 * Validates and safely loads all saved projects from browser localStorage.
 */
export function getSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoragePayload | SavedProject[];
    
    // Support legacy array format or versioned payload
    let list: SavedProject[] = [];
    if (Array.isArray(parsed)) {
      list = parsed;
    } else if (parsed && Array.isArray(parsed.projects)) {
      list = parsed.projects;
    }

    // Defensive validation of each item
    return list.filter((p) => Boolean(p && typeof p.id === 'string' && p.proposal && p.brief));
  } catch (err) {
    console.error('Failed to parse saved ScopeMate projects from localStorage:', err);
    return [];
  }
}

/**
 * Saves or updates a project in localStorage.
 */
export function saveProject(project: SavedProject): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getSavedProjects();
    const existingIndex = current.findIndex((p) => p.id === project.id);
    
    const updatedProject: SavedProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    let nextProjects: SavedProject[];
    if (existingIndex >= 0) {
      nextProjects = [...current];
      nextProjects[existingIndex] = updatedProject;
    } else {
      nextProjects = [updatedProject, ...current];
    }

    const payload: StoragePayload = {
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      projects: nextProjects,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save project to localStorage:', err);
  }
}

/**
 * Deletes a single project by ID.
 */
export function deleteProject(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getSavedProjects();
    const nextProjects = current.filter((p) => p.id !== id);

    const payload: StoragePayload = {
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      projects: nextProjects,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to delete project from localStorage:', err);
  }
}

/**
 * Clears all stored projects from localStorage.
 */
export function clearAllProjects(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear ScopeMate projects:', err);
  }
}

/**
 * Exports all projects as a downloadable JSON string.
 */
export function exportProjectsJson(): string {
  const projects = getSavedProjects();
  return JSON.stringify({ version: STORAGE_VERSION, exportedAt: new Date().toISOString(), projects }, null, 2);
}
