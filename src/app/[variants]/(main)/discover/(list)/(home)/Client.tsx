'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { DiscoverAssistantItem, DiscoverModelItem } from '@/types/discover';

import Title from '../../components/Title';
import AssistantList from './features/AssistantList';
import ModelList from './features/ModelList';

interface ClientProps {
  assistantList: DiscoverAssistantItem[];
  modelList: DiscoverModelItem[];
}

const Client = memo<ClientProps>(({ modelList, assistantList }) => {
  const { t } = useTranslation('discover');
  return (
    <>
      <Title more={t('home.more')} moreLink={'/discover/assistants'}>
        {t('home.featuredAssistants')}
      </Title>
      <AssistantList data={assistantList} />
      <div />
      <Title more={t('home.more')} moreLink={'/discover/models'}>
        {t('home.featuredModels')}
      </Title>
      <div />
      <ModelList data={modelList} />
    </>
  );
});

export default Client;
