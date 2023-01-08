import { useMemo } from 'react';

import type { Item } from './Selector.types';
import { groupingItems, searchItems } from './Selector.func';

export const useItemGroups = (items: Item[]) => (
  useMemo(() => groupingItems(items), [items])
);

export const useSearchedItems = (...args: Parameters<typeof searchItems>) => (
  useMemo(() => searchItems(...args), [...args])
);
