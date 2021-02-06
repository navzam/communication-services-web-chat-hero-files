export const SET_FILE_BLOB_URL = 'SET_FILE_BLOB_URL';

export interface SetFileBlobUrlAction {
    type: typeof SET_FILE_BLOB_URL;
    fileId: string;
    blobUrl: string | null;
}

export const setFileBlobUrl = (fileId: string, blobUrl: string | null): SetFileBlobUrlAction => {
    return {
        type: SET_FILE_BLOB_URL,
        fileId,
        blobUrl
    };
};

export type FilesActionTypes =
    | SetFileBlobUrlAction;