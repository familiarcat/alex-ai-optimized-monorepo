"use strict";
// @alex-ai/shared utils
// Shared utility functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = exports.sleep = exports.validateEmail = exports.generateId = exports.formatDate = void 0;
const formatDate = (date) => {
    return date.toISOString();
};
exports.formatDate = formatDate;
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateId = generateId;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalize = capitalize;
exports.default = {
    formatDate: exports.formatDate,
    generateId: exports.generateId,
    validateEmail: exports.validateEmail,
    sleep: exports.sleep,
    capitalize: exports.capitalize
};
//# sourceMappingURL=index.js.map