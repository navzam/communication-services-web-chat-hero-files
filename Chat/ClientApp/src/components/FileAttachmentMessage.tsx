import React, { useEffect, useState } from 'react';
import { Spinner, Stack, Text } from '@fluentui/react';
import { Attachment, DownloadIcon, FilesEmptyIcon } from '@fluentui/react-northstar';
import AutoDownloadLink from './AutoDownloadLink';
import { imageLoadingStackStyle, imagePreviewStyle } from './styles/FileAttachmentMessage.styles';

export interface FileAttachmentMessageProps {
  fileId: string;
  fileName: string;
  blobUrl: string | null;
  downloadFile: (fileId: string) => void;
  clearFileBlobUrl: (fileId: string) => void;
}

// Checks if a file is a previewable image based on the filename
function isPreviewableImage(fileName: string): boolean {
  return (/\.(png|jpg)$/i).test(fileName);
}

export default (props: FileAttachmentMessageProps): JSX.Element => {
  const [downloadClicked, setDownloadClicked] = useState<boolean>(false);

  useEffect(() => {
    if (isPreviewableImage(props.fileName) && props.blobUrl === null) {
      props.downloadFile(props.fileId);
    }
  }, [props.fileName, props.blobUrl, props.fileId, props.downloadFile]);

  if (isPreviewableImage(props.fileName)) {
    return props.blobUrl !== null
      ? (
        <img src={props.blobUrl} className={imagePreviewStyle} />
      )
      : (
        <Stack horizontalAlign="center" verticalAlign="center" className={imageLoadingStackStyle}>
          <Spinner />
          <Text>Loading image...</Text>
        </Stack>
      );
  }

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