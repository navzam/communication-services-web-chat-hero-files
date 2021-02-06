import { Reducer } from 'redux';
import { FilesActionTypes, SET_FILE_BLOB_URL } from '../actions/FilesAction';

interface File {
    blobUrl: string | null;
}

export interface FilesState {
    files: Map<string, File>,
}

const initialState: FilesState = {
    files: new Map<string, File>(),
};

export const FilesReducer: Reducer<FilesState, FilesActionTypes> = (state = initialState, action: FilesActionTypes): FilesState => {
    switch (action.type) {
        case SET_FILE_BLOB_URL: {
            // if (!state.files.has(action.fileId)) return state;

            const copiedFilesMap = new Map<string, File>(state.files);
            const currentFile = copiedFilesMap.get(action.fileId);
            if (currentFile === undefined) {
                copiedFilesMap.set(action.fileId, { blobUrl: action.blobUrl });
            } else {
                copiedFilesMap.set(action.fileId, {
                    ...currentFile,
                    blobUrl: action.blobUrl,
                });
            }

            return { ...state, files: copiedFilesMap }
        }
        default:
            return state;
    }
};