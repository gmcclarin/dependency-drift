"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotFormatError = exports.SnapshotParseError = exports.SnapshotReadError = exports.DependencySourceError = void 0;
class DependencySourceError extends Error {
    constructor(message) {
        super(message);
        this.name = new.target.name;
    }
}
exports.DependencySourceError = DependencySourceError;
class SnapshotReadError extends DependencySourceError {
}
exports.SnapshotReadError = SnapshotReadError;
class SnapshotParseError extends DependencySourceError {
}
exports.SnapshotParseError = SnapshotParseError;
class SnapshotFormatError extends DependencySourceError {
}
exports.SnapshotFormatError = SnapshotFormatError;
