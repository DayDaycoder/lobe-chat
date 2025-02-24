import { ActionIcon, Icon, Tooltip } from '@lobehub/ui';
import { Dropdown, MenuProps, Upload , message } from 'antd';
import { css, cx } from 'antd-style';
import { FileUp, FolderUp, ImageUp, Paperclip } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useModelSupportVision } from '@/hooks/useModelSupportVision';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/slices/chat';
import { useFileStore } from '@/store/file';

const hotArea = css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: transparent;
  }
`;

const parseCookies = () => {
  if (typeof document === 'undefined') return {};
  const cookies: Record<string, string> = {};
  document.cookie
    .split('; ')
    .filter((item) => item.trim() !== '')
    .forEach((item) => {
      const [key, value] = item.split('=');
      cookies[key] = decodeURIComponent(value || '');
    });
  return cookies;
};

const FileUpload = memo(() => {
  const { t } = useTranslation('chat');
  const [hasCookie, setHasCookie] = useState(false);

  useEffect(() => {
    console.log('document.cookie', document.cookie);
    const cookieObj = parseCookies();

    if (cookieObj.chatToken) {
      setHasCookie(!!cookieObj.chatToken);
    }
  }, []);

  const upload = useFileStore((s) => s.uploadChatFiles);

  const model = useAgentStore(agentSelectors.currentAgentModel);
  const provider = useAgentStore(agentSelectors.currentAgentModelProvider);

  // 服务端能计算的部分
  const serverSideCheck = useModelSupportVision(model, provider);
  // 最终条件 = 服务端条件 + 客户端条件
  const canUploadImage = serverSideCheck && !hasCookie;

  const items: MenuProps['items'] = [
    {
      disabled: !canUploadImage,
      icon: <Icon icon={ImageUp} style={{ fontSize: '16px' }} />,
      key: 'upload-image',
      label: canUploadImage ? (
        <Upload
          accept={'image/*'}
          beforeUpload={async (file) => {
            await upload([file]);

            return false;
          }}
          multiple
          showUploadList={false}
        >
          <div className={cx(hotArea)}>{t('upload.action.imageUpload')}</div>
        </Upload>
      ) : (
        <Tooltip placement={'right'} title={t('upload.action.imageDisabled')}>
          <div className={cx(hotArea)}>{t('upload.action.imageUpload')}</div>
        </Tooltip>
      ),
      style: {
        display: canUploadImage ? 'block' : 'none',
      },
    },
    {
      icon: <Icon icon={FileUp} style={{ fontSize: '16px' }} />,
      key: 'upload-file',
      label: (
        <Upload
          beforeUpload={async (file) => {
            if (!canUploadImage && file.type.startsWith('image')) {
              message.error('不支持上传图片'); // 显示错误提示
              return false;
            } 

            await upload([file]);

            return false;
          }}
          multiple
          showUploadList={false}
        >
          <div className={cx(hotArea)}>{t('upload.action.fileUpload')}</div>
        </Upload>
      ),
    },
    {
      icon: <Icon icon={FolderUp} style={{ fontSize: '16px' }} />,
      key: 'upload-folder',
      label: (
        <Upload
          beforeUpload={async (file) => {
            if (!canUploadImage && file.type.startsWith('image')) {
              message.error('不支持上传图片'); // 显示错误提示
              return false;
            } 

            await upload([file]);

            return false;
          }}
          directory
          multiple={true}
          showUploadList={false}
        >
          <div className={cx(hotArea)}>{t('upload.action.folderUpload')}</div>
        </Upload>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="top">
      <ActionIcon icon={Paperclip} placement={'bottom'} title={t('upload.action.tooltip')} />
    </Dropdown>
  );
});

export default FileUpload;
