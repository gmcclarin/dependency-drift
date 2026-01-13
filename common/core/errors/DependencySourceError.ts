

export abstract class DependencySourceError extends Error {
    constructor( message: string) {
        super(message);
        this.name = new.target.name
    }
}

export class SnapshotReadError extends DependencySourceError {}
export class SnapshotParseError extends DependencySourceError {}
export class SnapshotFormatError extends DependencySourceError {}