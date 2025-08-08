/**
 * Story access control for reading comprehension stories
 * All stories are premium by default, except an explicit allowlist of free stories
 */

// Titles of stories that are free for everyone
export const FREE_STORY_TITLES: string[] = [
  'The Rise of the Gig Economy'
];

// Normalize strings to compare titles robustly (case-insensitive, collapsed spaces, handle URL-encoded)
const normalize = (s: string): string => {
  try { s = decodeURIComponent(s); } catch {}
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
};

// Check if a story is free based on its title or URL id
export const isFreeStory = (titleOrId: string): boolean => {
  const target = normalize(titleOrId);
  return FREE_STORY_TITLES.map(normalize).includes(target);
};

// Check if user has access to a story: premium/admin OR the story is free
export const checkStoryAccess = (titleOrId: string, isPremium: boolean, isAdmin: boolean): boolean => {
  return Boolean(isPremium || isAdmin || isFreeStory(titleOrId));
};
