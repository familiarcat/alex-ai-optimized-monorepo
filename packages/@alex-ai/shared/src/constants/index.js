"use strict";
// @alex-ai/shared constants
// Shared constants and configuration
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_TYPES = exports.SYSTEM_STATUS = exports.CREW_MEMBERS = exports.ALEX_AI_VERSION = void 0;
exports.ALEX_AI_VERSION = '2.1.0';
exports.CREW_MEMBERS = [
    'Captain Picard',
    'Commander Data',
    'Lt. Commander La Forge',
    'Dr. Beverly Crusher',
    'Counselor Deanna Troi',
    'Lieutenant Worf',
    'Lieutenant Uhura',
    'Quark',
    'Seven of Nine'
];
exports.SYSTEM_STATUS = {
    HEALTHY: 'healthy',
    WARNING: 'warning',
    ERROR: 'error'
};
exports.TASK_TYPES = [
    'build',
    'test',
    'deploy',
    'monitor',
    'analyze',
    'optimize'
];
exports.default = {
    ALEX_AI_VERSION: exports.ALEX_AI_VERSION,
    CREW_MEMBERS: exports.CREW_MEMBERS,
    SYSTEM_STATUS: exports.SYSTEM_STATUS,
    TASK_TYPES: exports.TASK_TYPES
};
//# sourceMappingURL=index.js.map