import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FileMetadata, FileService } from '../services/fileService';

interface UploadFileRequestBody {
    fileName?: string;
}

export default function createFileRouter(fileService: FileService) {
    const uploadMiddleware = multer({ limits: { fieldSize: 5 * 1024 * 1024 } });

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

        return res.sendStatus(204);
    });

    return router;
}