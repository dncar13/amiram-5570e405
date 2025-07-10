/**
 * Reading Comprehension Topic Configuration
 * Maps topic IDs to their names and metadata for the reading comprehension section
 */

import { Brain, Microscope, Users, TrendingUp, Cpu, Leaf, Clock, Heart, GraduationCap, Shuffle } from 'lucide-react';

export interface ReadingTopic {
  id: number;
  name: string;
  nameHebrew: string;
  description: string;
  descriptionHebrew: string;
  icon: any;
  color: string;
  questionCount?: number;
}

// Based on actual topics in the database - only showing topics that have questions
export const READING_COMPREHENSION_TOPICS: ReadingTopic[] = [
  {
    id: 2,
    name: 'Technology',
    nameHebrew: 'טכנולוגיה',
    description: 'Technological advances and digital transformation',
    descriptionHebrew: 'התקדמות טכנולוגית וטרנספורמציה דיגיטלית',
    icon: Cpu,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 3,
    name: 'Economy',
    nameHebrew: 'כלכלה',
    description: 'Economic concepts, business, and finance',
    descriptionHebrew: 'מושגים כלכליים, עסקים ופיננסים',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 7,
    name: 'Environment',
    nameHebrew: 'סביבה',
    description: 'Environmental issues, climate, and sustainability',
    descriptionHebrew: 'נושאי סביבה, אקלים וקיימות',
    icon: Leaf,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
];

// Special topic for mixed content
export const MIXED_TOPIC: ReadingTopic = {
  id: 0,
  name: 'Mixed',
  nameHebrew: 'מעורב',
  description: 'A mix of all topics for varied practice',
  descriptionHebrew: 'שילוב של כל הנושאים לתרגול מגוון',
  icon: Shuffle,
  color: 'bg-gray-100 text-gray-800 border-gray-200'
};

export function getReadingTopicById(id: number): ReadingTopic | undefined {
  if (id === 0) return MIXED_TOPIC;
  return READING_COMPREHENSION_TOPICS.find(topic => topic.id === id);
}

export function getReadingTopicName(id: number, hebrew: boolean = true): string {
  const topic = getReadingTopicById(id);
  return topic ? (hebrew ? topic.nameHebrew : topic.name) : 'לא ידוע';
}

export function getAllReadingTopicsWithMixed(): ReadingTopic[] {
  return [MIXED_TOPIC, ...READING_COMPREHENSION_TOPICS];
}