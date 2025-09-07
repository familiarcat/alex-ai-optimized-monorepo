// @alex-ai/shared constants
// Shared constants and configuration

export const ALEX_AI_VERSION = '2.1.0';
export const CREW_MEMBERS = [
  'Captain Picard',
  'Commander Data',
  'Lt. Commander La Forge',
  'Dr. Beverly Crusher',
  'Counselor Deanna Troi',
  'Lieutenant Worf',
  'Lieutenant Uhura',
  'Quark',
  'Seven of Nine'
] as const;

export const SYSTEM_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

export const TASK_TYPES = [
  'build',
  'test',
  'deploy',
  'monitor',
  'analyze',
  'optimize'
] as const;

export default {
  ALEX_AI_VERSION,
  CREW_MEMBERS,
  SYSTEM_STATUS,
  TASK_TYPES
};
