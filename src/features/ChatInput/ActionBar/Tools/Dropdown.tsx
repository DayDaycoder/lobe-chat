import { Avatar } from '@lobehub/ui';
import { Dropdown } from 'antd';
import { createStyles } from 'antd-style';
import type { ItemType } from 'antd/es/menu/interface';
import isEqual from 'fast-deep-equal';
import { PropsWithChildren, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCheckPluginsIsInstalled } from '@/hooks/useCheckPluginsIsInstalled';
import { useFetchInstalledPlugins } from '@/hooks/useFetchInstalledPlugins';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useToolStore } from '@/store/tool';
import { builtinToolSelectors } from '@/store/tool/selectors';

import ToolItem from './ToolItem';

const useStyles = createStyles(({ css, prefixCls }) => ({
  menu: css`
    &.${prefixCls}-dropdown-menu {
      padding-block: 8px;
    }

    .${prefixCls}-dropdown-menu-item-group-list .${prefixCls}-dropdown-menu-item {
      padding: 0;
      border-radius: 4px;
    }
  `,
}));

const DropdownMenu = memo<PropsWithChildren>(({ children }) => {
  const { t } = useTranslation('setting');
  const { showDalle } = useServerConfigStore(featureFlagsSelectors);
  const builtinList = useToolStore(builtinToolSelectors.metaList(showDalle), isEqual);

  const { styles } = useStyles();

  const items: ItemType[] = [
    (builtinList.length !== 0 && {
      children: builtinList.map((item) => ({
        icon: <Avatar avatar={item.meta.avatar} size={24} />,
        key: item.identifier,
        label: (
          <ToolItem identifier={item.identifier} label={item.meta?.title || item.identifier} />
        ),
      })),

      key: 'builtins',
      label: t('tools.builtins.groupName'),
      type: 'group',
    }) as ItemType,
  ].filter(Boolean);

  const plugins = useAgentStore((s) => agentSelectors.currentAgentPlugins(s));

  const [useFetchPluginStore] = useToolStore((s) => [s.useFetchPluginStore]);

  useFetchPluginStore();
  useFetchInstalledPlugins();
  useCheckPluginsIsInstalled(plugins);

  return (
    <Dropdown
        arrow={false}
        menu={{
          className: styles.menu,
          items,
          onClick: (e) => {
            e.domEvent.preventDefault();
          },
          style: {
            maxHeight: 500,
            overflowY: 'scroll',
          },
        }}
        placement={'top'}
        trigger={['click']}
      >
        {children}
      </Dropdown>
  );
});

export default DropdownMenu;
