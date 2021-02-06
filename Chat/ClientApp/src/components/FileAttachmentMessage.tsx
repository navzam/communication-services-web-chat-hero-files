import React, { useState } from 'react';
import { Attachment, DownloadIcon, FilesEmptyIcon } from '@fluentui/react-northstar';
import AutoDownloadLink from './AutoDownloadLink';

export interface FileAttachmentMessageProps {
  fileId: string;
  fileName: string;
  blobUrl: string | null;
  downloadFile: (fileId: string) => void;
  clearFileBlobUrl: (fileId: string) => void;
}

export default (props: FileAttachmentMessageProps): JSX.Element => {
  const [downloadClicked, setDownloadClicked] = useState<boolean>(false);

  return (
    <>
      <Attachment
        header={props.fileName}
        description={props.fileId}
        icon={<FilesEmptyIcon outline />}
        action={{
          icon: <DownloadIcon />,
          loading: downloadClicked,
          disabled: downloadClicked,
          onClick: (e) => {
            setDownloadClicked(true);
            if (!props.blobUrl) {
              props.downloadFile(props.fileId);
            }

            e.stopPropagation();
          },
        }}
        actionable
        onClick={() => console.log(`Attachment clicked for file ${props.fileId}`)}
      />
      {(downloadClicked && props.blobUrl !== null) &&
        <AutoDownloadLink
          link={props.blobUrl}
          downloadName={props.fileName}
          onTriggered={() => {
            setDownloadClicked(false);
            props.clearFileBlobUrl(props.fileId);
            // TODO: should also revoke the object URL somewhere
          }}
        />
      }
    </>
  );
}