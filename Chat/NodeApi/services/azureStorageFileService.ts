import { BlobServiceClient, ContainerClient, RestError } from "@azure/storage-blob";
import { TableClient, TableEntity } from "@azure/data-tables";

import { FileMetadata, FileService } from "./fileService";

interface TableStorageFileMetadata {
    FileId: string;
    FileName: string;
    UploadDateTime: Date;
}

export class AzureStorageFileService implements FileService {
    constructor(
        private storageConnectionString: string,
        private blobContainerName: string,
        private tableName: string,
    ) { }

    async uploadFile(fileId: string, fileBuffer: Buffer): Promise<void> {
        const blobServiceClient = BlobServiceClient.fromConnectionString(this.storageConnectionString);
        const containerClient = blobServiceClient.getContainerClient(this.blobContainerName);
        await AzureStorageFileService.ensureBlobContainerCreated(containerClient);

        const blobClient = containerClient.getBlockBlobClient(fileId);

        await blobClient.uploadData(fileBuffer);
    }

    async addFileMetadata(threadId: string, fileMetadata: FileMetadata): Promise<void> {
        const tableClient = TableClient.fromConnectionString(this.storageConnectionString, this.tableName);
        await AzureStorageFileService.ensureTableCreated(tableClient);

        const entity: TableEntity<TableStorageFileMetadata> = {
            partitionKey: threadId,
            rowKey: fileMetadata.id,
            FileId: fileMetadata.id,
            FileName: fileMetadata.name,
            UploadDateTime: fileMetadata.uploadDateTime,
        };
        await tableClient.createEntity(entity);
    }

    private static async ensureBlobContainerCreated(containerClient: ContainerClient): Promise<void> {
        await containerClient.createIfNotExists();
    }

    private static async ensureTableCreated(tableClient: TableClient): Promise<void> {
        try {
            await tableClient.create();
        } catch (e) {
            if (e instanceof RestError && e.statusCode === 409) {
                return;
            }
    
            throw e;
        }
    }
}