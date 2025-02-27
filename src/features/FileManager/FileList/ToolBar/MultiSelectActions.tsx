import { Icon } from '@lobehub/ui';
import { App, Button, Checkbox, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { FileBoxIcon, Trash2Icon } from 'lucide-react';
import { rgba } from 'polished';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  container: css`
    height: 40px;
    padding-block-end: 12px;
    border-block-end: 1px solid ${isDarkMode ? token.colorSplit : rgba(token.colorSplit, 0.06)};
  `,
  total: css`
    cursor: pointer;
    height: 27px;
  `,
}));

export type MultiSelectActionType =
  | 'addToKnowledgeBase'
  | 'delete'
  | 'batchChunking'
  | 'removeFromKnowledgeBase'
  | 'addToOtherKnowledgeBase';

interface MultiSelectActionsProps {
  onActionClick: (type: MultiSelectActionType) => Promise<void>;
  onClickCheckbox: () => void;
  selectCount: number;
  total?: number;
}

const MultiSelectActions = memo<MultiSelectActionsProps>(
  ({ selectCount, total, onActionClick, onClickCheckbox }) => {
    const { t } = useTranslation(['components', 'common']);
    const { styles } = useStyles();

    const isSelectedFiles = selectCount > 0;
    const { modal, message } = App.useApp();
    return (
      <Flexbox align={'center'} gap={12} horizontal>
        <Flexbox
          align={'center'}
          className={styles.total}
          gap={8}
          horizontal
          onClick={onClickCheckbox}
          paddingInline={4}
        >
          <Checkbox
            checked={selectCount === total}
            indeterminate={isSelectedFiles && selectCount !== total}
          />
          {typeof total === 'undefined' ? (
            <Skeleton
              active
              paragraph={{ rows: 1, style: { marginBottom: 0, width: 60 }, width: '100%' }}
              title={false}
            />
          ) : (
            <div style={{ height: 18 }}>
              {isSelectedFiles
                ? t('FileManager.total.selectedCount', { count: selectCount })
                : t('FileManager.total.fileCount', { count: total })}
            </div>
          )}
        </Flexbox>
        {isSelectedFiles && (
          <Flexbox gap={8} horizontal>
            <Button
              icon={<Icon icon={FileBoxIcon} />}
              onClick={async () => {
                await onActionClick('batchChunking');
              }}
              size={'small'}
            >
              {t('FileManager.actions.batchChunking')}
            </Button>
            <Button
              danger
              icon={<Icon icon={Trash2Icon} />}
              onClick={async () => {
                modal.confirm({
                  okButtonProps: {
                    danger: true,
                  },
                  onOk: async () => {
                    await onActionClick('delete');
                    message.success(t('FileManager.actions.deleteSuccess'));
                  },
                  title: t('FileManager.actions.confirmDeleteMultiFiles', { count: selectCount }),
                });
              }}
              size={'small'}
            >
              {t('batchDelete', { ns: 'common' })}
            </Button>
          </Flexbox>
        )}
      </Flexbox>
    );
  },
);

export default MultiSelectActions;
