import { Flexbox } from 'react-layout-kit';

const KnowledgeBase = () => {

  return (
    <Flexbox flex={1} gap={8}>
      {/* <Flexbox
        align={'center'}
        className={styles.header}
        horizontal
        justify={'space-between'}
        paddingInline={'16px 12px'}
      >
        <Flexbox align={'center'} gap={8} horizontal>
          <ActionIcon
            icon={(showList ? CaretDownFilled : CaretRightOutlined) as any}
            onClick={() => {
              setShowList(!showList);
            }}
            size={'small'}
          />
          <div style={{ lineHeight: '14px' }}>{t('knowledgeBase.title')}</div>
        </Flexbox>
        <ActionIcon icon={PlusIcon} onClick={open} size={'small'} title={t('knowledgeBase.new')} />
      </Flexbox>

      {showList && <KnowledgeBaseList />} */}
    </Flexbox>
  );
};

export default KnowledgeBase;
