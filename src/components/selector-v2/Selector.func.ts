import type { Item } from './Selector.types';


const REGEX = {
  CAPTURE_GROUP: /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g,
  FORMATTED_QUOTE: /[“”]/g,
  LEADING_ENDING_QUOTE: /(^")|("$)/g,
};

type Option = {
  freeform: boolean;
};

export const groupingItems = (items: Item[]) => (
  Object
    .entries(
      items.reduce<Record<string, Item[]>>((groups, item) => ({
        ...groups,
        [item?.group ?? 'All Values']: [
          ...(groups[item?.group ?? 'All Values'] ?? []),
          item,
        ],
      }), { 'All Values': [] }),
    )
    .filter(([, groupedItems]) => groupedItems.length > 0)
);

export const searchItems = (
  items: Item[],
  query: string,
  option: Partial<Option> = {},
) => {
  if (!query.trim()) {
    return [];
  }

  const cache = new Set<string>();
  const results = items.filter(item => (
    `${item.value}`.toLowerCase().includes(query.trim().toLowerCase()) ||
    `${item.label}`.toLowerCase().includes(query.trim().toLowerCase())
  ));

  if (option.freeform) {
    const groups = query
      .replace(REGEX.FORMATTED_QUOTE, '"')
      .match(REGEX.CAPTURE_GROUP) ?? [];

    const freeformGroups = groups
      .map(item => item.replace(REGEX.LEADING_ENDING_QUOTE, '').trim())
      .filter(Boolean);

    if (freeformGroups.length > 1) {
      freeformGroups.forEach((value) => {
        const item: Item = { value, label: value };
        results.push(item);
      }, []);
    }
  }

  // [ABRRO-3059] Actuals에서 중복된 value를 가진 아이템의 검색 결과를 내려줄 때는 하나로 통일해야 함
  return results.filter(({ value }) => {
    if (cache.has(value)) {
      return false;
    }

    cache.add(value);
    return true;
  });
};
