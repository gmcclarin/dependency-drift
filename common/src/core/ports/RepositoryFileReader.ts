
export interface RepositoryFileReader{
    readFile(path: string): Promise<string>;
}