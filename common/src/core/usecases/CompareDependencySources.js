"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareDependencySourcesService = void 0;
const compareSnapshots_1 = __importDefault(require("../compareSnapshots"));
class CompareDependencySourcesService {
    async execute(sourceA, sourceB) {
        const snapshotA = await sourceA.getSnapshot();
        const snapshotB = await sourceB.getSnapshot();
        return (0, compareSnapshots_1.default)(Object.freeze(snapshotA), Object.freeze(snapshotB));
    }
}
exports.CompareDependencySourcesService = CompareDependencySourcesService;
