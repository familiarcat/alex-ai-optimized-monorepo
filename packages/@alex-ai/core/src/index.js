"use strict";
/**
 * Alex AI Core Package - Central Integration Hub
 *
 * This package provides the core Alex AI functionality that all sub-projects
 * in the monorepo can use to integrate with the Alex AI system.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.AlexAICrewManager = exports.StealthScrapingService = exports.UnifiedDataService = exports.N8NCredentialsManager = exports.getAlexAIStatus = exports.getAlexAI = exports.initializeAlexAI = exports.AlexAIManager = void 0;
// Main Alex AI Manager
var alex_ai_manager_1 = require("./alex-ai-manager");
Object.defineProperty(exports, "AlexAIManager", { enumerable: true, get: function () { return alex_ai_manager_1.AlexAIManager; } });
Object.defineProperty(exports, "initializeAlexAI", { enumerable: true, get: function () { return alex_ai_manager_1.initializeAlexAI; } });
Object.defineProperty(exports, "getAlexAI", { enumerable: true, get: function () { return alex_ai_manager_1.getAlexAI; } });
Object.defineProperty(exports, "getAlexAIStatus", { enumerable: true, get: function () { return alex_ai_manager_1.getAlexAIStatus; } });
// Core Services
var n8n_credentials_manager_1 = require("./n8n-credentials-manager");
Object.defineProperty(exports, "N8NCredentialsManager", { enumerable: true, get: function () { return n8n_credentials_manager_1.N8NCredentialsManager; } });
var unified_data_service_1 = require("./unified-data-service");
Object.defineProperty(exports, "UnifiedDataService", { enumerable: true, get: function () { return unified_data_service_1.UnifiedDataService; } });
var stealth_scraping_service_1 = require("./stealth-scraping-service");
Object.defineProperty(exports, "StealthScrapingService", { enumerable: true, get: function () { return stealth_scraping_service_1.StealthScrapingService; } });
var crew_manager_1 = require("./crew-manager");
Object.defineProperty(exports, "AlexAICrewManager", { enumerable: true, get: function () { return crew_manager_1.AlexAICrewManager; } });
// Default export
var alex_ai_manager_2 = require("./alex-ai-manager");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(alex_ai_manager_2).default; } });
//# sourceMappingURL=index.js.map