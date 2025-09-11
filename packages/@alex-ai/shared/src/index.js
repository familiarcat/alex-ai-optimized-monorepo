"use strict";
// @alex-ai/shared
// Main export file for shared utilities, types, and constants
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alex_ai_shared = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./constants"), exports);
exports.alex_ai_shared = {
    version: '1.0.0',
    description: 'Shared utilities, types, and constants for Alex AI'
};
exports.default = exports.alex_ai_shared;
//# sourceMappingURL=index.js.map