import React from 'react';
import { Attachment, DownloadIcon, FilesEmptyIcon } from '@fluentui/react-northstar';

interface FileAttachmentMessageProps {
  fileId: string;
  fileName: string;
}

export default (props: FileAttachmentMessageProps): JSX.Element => {
  return (
    <Attachment
      header={props.fileName}
      description={props.fileId}
      icon={<FilesEmptyIcon outline />}
      action={{
        icon: <DownloadIcon />,
        onClick: () => console.log(`Download clicked for file ${props.fileId}`),
      }}
      actionable
      onClick={() => console.log(`Attachment clicked for file ${props.fileId}`)}
    />
  );
}