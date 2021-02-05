export interface FileService {
    uploadFile: (fileId: string, fileBuffer: Buffer) => Promise<void>;
    addFileMetadata: (threadId: string, fileMetadata: FileMetadata) => Promise<void>;
}

export interface FileMetadata {
    id: string;
    name: string;
    uploadDateTime: Date;
}