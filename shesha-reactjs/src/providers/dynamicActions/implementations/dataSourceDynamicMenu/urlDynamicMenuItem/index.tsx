import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import { useTemplates } from '../utils';
import { useAppConfigurator } from '@/providers/appConfigurator';
import { ButtonGroupItemProps } from '@/providers/buttonGroupConfigurator';
import { DynamicActionsProvider, DynamicItemsEvaluationHook, FormMarkup, useDataContextManager, useFormData, useGlobalState } from '@/providers';
import settingsJson from './urlSettings.json';
import { useGet } from '@/hooks';
import { IDataSourceArguments, IWorkflowInstanceStartActionsProps } from '../model';

const settingsMarkup = settingsJson as FormMarkup;

const useUrlActions: DynamicItemsEvaluationHook<IDataSourceArguments> = ({ item, settings }) => {
  const { actionConfiguration, labelProperty, tooltipProperty, buttonType, groupingProperty, sortBy, sortOrder } = settings ?? {};
  const { refetch } = useGet({ path: '', lazy: true });
  const { getTemplateState } = useTemplates(settings);
  const [data, setData] = useState(null);
  const pageContext = useDataContextManager(false)?.getPageContext();
  const { data: FormData } = useFormData();
  const { globalState } = useGlobalState();

  useEffect(() => {
    refetch(getTemplateState()).then((response) => {
        const result = Array.isArray(response.result) ? response.result : response.result.items;
        setData(result);
    });
}, [item, settings, pageContext, FormData, globalState]);


  const { configurationItemMode } = useAppConfigurator();

  const operations = useMemo<ButtonGroupItemProps[]>(() => {
    if (!data) return [];

    const makeItem = (p: any): ButtonGroupItemProps => ({
      id: p.id,
      name: p.name,
      label: p[`${labelProperty}`] || 'Not Configured Properly',
      tooltip: p[`${tooltipProperty}`],
      itemType: 'item',
      itemSubType: 'button',
      sortOrder: 0,
      dynamicItem: p,
      buttonType: buttonType,
      actionConfiguration: actionConfiguration,
    });

    // Apply client-side sort if sortBy is specified
    const sorted = sortBy
      ? [...data].sort((a, b) => {
          const aVal = a[sortBy] ?? '';
          const bVal = b[sortBy] ?? '';
          const cmp = String(aVal).localeCompare(String(bVal));
          return sortOrder === 'desc' ? -cmp : cmp;
        })
      : data;

    // Apply grouping: produce IButtonGroup items with childItems
    if (groupingProperty) {
      const groups = new Map<string, ButtonGroupItemProps[]>();
      sorted.forEach((p) => {
        const groupKey = String(p[groupingProperty] ?? '');
        if (!groups.has(groupKey)) groups.set(groupKey, []);
        groups.get(groupKey).push(makeItem(p));
      });

      return Array.from(groups.entries()).map(([groupLabel, children], idx) => ({
        id: `group-${groupLabel}-${idx}`,
        name: groupLabel,
        label: groupLabel,
        itemType: 'group',
        sortOrder: idx,
        hideWhenEmpty: true,
        childItems: children,
      } as ButtonGroupItemProps));
    }

    return sorted.map(makeItem);
  }, [item, data, configurationItemMode]);

  return operations;
};

export const UrlActions: FC<PropsWithChildren<IWorkflowInstanceStartActionsProps>> = ({ children }) => {
  return (
    <DynamicActionsProvider
      id="Url"
      name="Url"
      useEvaluator={useUrlActions}
      hasArguments={true}
      settingsFormMarkup={settingsMarkup}
    >
      {children}
    </DynamicActionsProvider>
  );
};
