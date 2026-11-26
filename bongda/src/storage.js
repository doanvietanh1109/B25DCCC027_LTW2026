const STORAGE_KEY = 'ltw_bongda_matches';

export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const matches = JSON.parse(raw);
    return Array.isArray(matches) ? matches : null;
  } catch (error) {
    return null;
  }
};

export const saveMatches = (matches) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(matches)); } catch (error) { /* Storage may be unavailable. */ }
};
