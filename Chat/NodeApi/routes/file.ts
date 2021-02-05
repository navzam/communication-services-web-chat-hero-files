import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { FileMetadata, FileService } from '../services/fileService';
import * as tokenManager from '../tokenManager';
import { extractApiChatGatewayUrl } from '../utils';

interface UploadFileRequestBody {
    fileName?: string;
    userId?: string;
    userDisplayName?: string;
}

export default function createFileRouter(acsConnectionString: string, fileService: FileService) {
    const uploadMiddleware = multer({ limits: { fieldSize: 5 * 1024 * 1024 } });
    const chatGatewayUrl = extractApiChatGatewayUrl(acsConnectionString);

    const router = express.Router({ mergeParams: true });

    router.post('/', uploadMiddleware.single('file'), async (req, res) => {
        const threadId = req.params['threadId'];
        const body = req.body as UploadFileRequestBody;

        if (threadId === undefined || threadId.length === 0) {
            return res.status(404);
        }

        if (req.file === undefined) {
            return res.status(400).send("Invalid file");
        }

        if (body.fileName === undefined || body.fileName.length === 0) {
            return res.status(400).send("Invalid file name");
        }

        if (body.userId === undefined || body.userId.length === 0) {
            return res.status(400).send("Invalid user ID");
        }

        if (body.userDisplayName === undefined || body.userDisplayName.length === 0) {
            return res.status(400).send("Invalid user display name");
        }

        // Upload file to storage
        const newFileId: string = uuidv4();
        await fileService.uploadFile(newFileId, req.file.buffer);

        // Add file metadata to storage
        const newFileMetadata: FileMetadata = {
            id: newFileId,
            name: body.fileName,
            uploadDateTime: new Date(),
        };
        await fileService.addFileMetadata(threadId, newFileMetadata);

        // Send file "event" message to chat thread
        const tokenResponse = await tokenManager.refreshTokenAsync(acsConnectionString, body.userId);
        const chatClient = new ChatClient(chatGatewayUrl, new AzureCommunicationUserCredential(tokenResponse.token));
        const chatThreadClient = await chatClient.getChatThreadClient(threadId);
        
        const fileMessage = {
            event: 'FileUpload',
            fileId: newFileId,
            fileName: body.fileName,
        };
        await chatThreadClient.sendMessage({ content: JSON.stringify(fileMessage) }, { senderDisplayName: body.userDisplayName });

        return res.sendStatus(204);
    });

    return router;
}