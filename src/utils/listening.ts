export function buildListeningUrl(basePath: string, level: 'easy' | 'medium' | 'hard', mode: 'free' | 'premium') {
  const url = new URL(window.location.origin + basePath);
  url.searchParams.set('level', level);
  url.searchParams.set('mode', mode);
  return url.pathname + url.search;
}

export function getSavedSelection() {
  try {
    const raw = localStorage.getItem('listening_selection');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!['easy','medium','hard'].includes(parsed.level)) return null;
    if (!['free','premium'].includes(parsed.mode)) return null;
    return parsed as { level: 'easy'|'medium'|'hard'; mode: 'free'|'premium' };
  } catch {
    return null;
  }
}

export function saveSelection(level: 'easy'|'medium'|'hard', mode: 'free'|'premium') {
  localStorage.setItem('listening_selection', JSON.stringify({ level, mode }));
}

export function parseParamsFromLocation(search: string) {
  const sp = new URLSearchParams(search);
  const level = (sp.get('level') as 'easy'|'medium'|'hard') || 'easy';
  const mode = (sp.get('mode') as 'free'|'premium') || 'free';
  const validLevel = ['easy','medium','hard'].includes(level) ? level : 'easy';
  const validMode = ['free','premium'].includes(mode) ? mode : 'free';
  return { level: validLevel, mode: validMode } as const;
}
