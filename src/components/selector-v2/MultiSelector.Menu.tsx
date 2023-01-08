import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { uniq } from 'lodash';

import SelectorMenu from './selector-menu';
import SelectorGroup from './selector-group';
import SelectorItemMulti from './selector-item-multi';

import { useSearchedItems, useItemGroups } from './Selector.hooks';

import * as types from './Selector.types';
import * as styles from './Selector.styles';
import useIsScrollEnd from '../../hooks/useIsScrollEnd';


type Props = {
  items: types.Item[];
  values: string[];

  selectorPlaceholder?: string;

  loading?: boolean;
  enableFreeform?: boolean;
  enableGroupSelect?: boolean;
  enableInfiniteScroll?: boolean;
  getGroupMessage?(targetGroup: string): string;

  collapseWhitelist?: string[] | ((name: string) => boolean);

  disabledValues?: string[];
  collapseCount?: number;

  groupDisableMessage?: string;

  limitCount?: number;

  top?: number;
  left?: number;
  right?: number;

  hasDescription?: boolean;

  onScrollEnd?(): void;
  onSearch?(e: React.ChangeEvent<HTMLInputElement>): void;
  onSync?({ prevValues, selectValues }: {
    prevValues?: string[];
    selectValues: string[];
  }): string[];

  onChange(values: string[]): void;
  onCancel(): void;
};

const SLICE_SIZE = 100;

const MultiSelectorMenu = React.forwardRef<types.MenuReference, Props>(({
  items,
  values: propValues,
  loading,
  enableFreeform,
  enableGroupSelect,
  enableInfiniteScroll = false,
  collapseWhitelist,
  disabledValues,
  collapseCount,
  groupDisableMessage,
  limitCount,
  selectorPlaceholder,
  top,
  left,
  right,
  hasDescription = false,
  onScrollEnd,
  onChange,
  onSync,
  onCancel,
  onSearch,
  getGroupMessage,
}, ref) => {
  const menuRef = useRef<types.SelectorMenuReference>(null);

  const [values, setValues] = useState(propValues);
  const [freeformValues, setFreeformValues] = useState<string[]>([]);
  const [descriptionTooltip, setDescriptionTooltip] = useState<types.Item | null>(null);

  const handleSetDescription = useCallback((item: types.Item | null) => {
    if (!hasDescription) { return; }
    setDescriptionTooltip(item);
  }, [hasDescription]);

  const [scrollBottom, setScrollBottom] = useState(0);

  const [groupElement, setGroupElement] = useState<HTMLDivElement | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);

  const [isScrollEnd, checkScrollEnd] = useIsScrollEnd(menuRef.current?.ref.list, 40, 200);

  const searchedItems = useSearchedItems(items, searchQuery, {
    freeform: enableFreeform,
  });

  const totalPage = useMemo(() => Math.ceil(items.length / SLICE_SIZE), [items.length]);

  const renderItems = useMemo(() => (
    enableInfiniteScroll ? items.slice(0, page * SLICE_SIZE) : items
  ), [enableInfiniteScroll, page, items]);

  const groups = useItemGroups(renderItems);

  const selectedItems = useMemo(() => (
    values.map(value => (
      items.find(item => item.value === value) ?? { value, label: value }
    ))
  ), [items, values]);

  const getCollapseCountOf = useCallback((name: string) => {
    if (collapseWhitelist === undefined) {
      return collapseCount;
    }

    if (Array.isArray(collapseWhitelist)) {
      return collapseWhitelist.includes(name) ? collapseCount : undefined;
    }

    if (typeof collapseWhitelist === 'function') {
      return collapseWhitelist(name) ? collapseCount : undefined;
    }

    return undefined;
  }, [collapseCount, collapseWhitelist]);


  const validateLimitExceeded = useCallback(() => (
    limitCount ? (values.length >= limitCount) : false
  ), [limitCount, values.length]);

  const validateDisabledItem = useCallback((item: types.Item) => (
    disabledValues?.includes(item.value) ||
    validateLimitExceeded()
  ), [disabledValues, validateLimitExceeded]);

  const validateSelectedItem = useCallback((item: types.Item) => (
    values.includes(item.value)
  ), [values]);

  /**
   * Handlers
   */

  const handleChangeSearchQuery = useCallback((keyword: string) => {
    if (onSearch) {
      setIsFetching(true);
    }

    setPage(1);
    setSearchQuery(keyword);
  }, [onSearch]);

  const handleClickSelectAllSearchedItems = useCallback(() => {
    setValues(prevValues => [
      ...prevValues,
      ...searchedItems
        .filter(item => !prevValues.includes(item.value))
        .map(({ value }) => value),
    ]);
  }, [searchedItems]);

  const handleClickItem = useCallback((clickedValue: string) => {
    if (onSync) {
      setValues(onSync({
        prevValues: values,
        selectValues: [clickedValue],
      }));
    } else {
      setValues((prevValues) => {
        const filteredPrevValues = prevValues.filter(value => clickedValue !== value);

        // 두개 개수가 같으면 처음부터 없었다는 뜻
        if (filteredPrevValues.length === prevValues.length) {
          return [...prevValues, clickedValue];
        }

        return filteredPrevValues;
      });
    }

    if (!menuRef.current?.element.list) {
      return;
    }

    const {
      scrollTop,
      scrollHeight,
    } = menuRef.current.element.list;

    const bottom = (scrollHeight - scrollTop) || 0;
    setScrollBottom(bottom);
  }, [onSync, values]);

  const handleClickFreeformItem = useCallback((clickedValue: string) => {
    setFreeformValues(prevValues => [
      ...prevValues,
      clickedValue,
    ]);
    handleClickItem(clickedValue);
  }, [handleClickItem]);

  const handleClickName = useCallback((name: string) => {
    const groupItems = items.filter(item => item?.group === name);
    const selectedGroupItems = selectedItems.filter(item => item?.group === name);

    if (!menuRef.current?.element.list) {
      return;
    }

    const {
      scrollTop,
      scrollHeight,
    } = menuRef.current.element.list;

    const bottom = (scrollHeight - scrollTop) || 0;
    setScrollBottom(bottom);

    if (onSync) {
      setValues(onSync({
        prevValues: values,
        selectValues: groupItems.map(item => item.value),
      }));
      return;
    }

    if (groupItems.length === selectedGroupItems.length) {
      setValues(selectedItems.filter(item => item?.group !== name).map(item => item.value));
      return;
    }

    setValues(uniq([...selectedItems, ...groupItems].map(item => item.value)));
  }, [items, onSync, selectedItems, values]);

  const handleSubmit = useCallback(() => {
    onChange(values);
  }, [onChange, values]);

  const handleScroll = useCallback(() => {
    checkScrollEnd();
  }, [checkScrollEnd]);

  const handleFocusInput = useCallback(() => {
    /* [ABRRO-3450]
      menuRef는 스크롤 영역만을 가리키고 있음.
      부득이하게 parentNode를 사용해 InputField를 잡도록 함
    */
    const container = menuRef.current?.element.container;
    const inputElement = container?.parentNode?.querySelector<HTMLInputElement>("input[type='search']");
    inputElement?.focus();
  }, []);

  const handleCollapse = useCallback((clickedGroupElement: HTMLDivElement) => {
    setGroupElement(clickedGroupElement);
  }, []);

  useEffect(() => {
    if (!loading) {
      setIsFetching(false);
    }
  }, [loading]);

  useEffect(() => {
    if (isScrollEnd) {
      if (enableInfiniteScroll && totalPage > page) {
        setPage(prev => prev + 1);
        return;
      }
      onScrollEnd?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollEnd]);

  useLayoutEffect(() => {
    if (!menuRef.current?.element.list || !scrollBottom) {
      return;
    }

    const { scrollHeight } = menuRef.current.element.list;
    menuRef.current.element.list.scrollTop = scrollHeight - scrollBottom;

    setScrollBottom(0);
  }, [scrollBottom]);

  useLayoutEffect(() => {
    if (!menuRef.current?.element.list || !groupElement) {
      return;
    }

    const groupThreshold = groupElement.offsetTop + 182;
    const needScroll = menuRef.current.element.list?.scrollTop > groupThreshold;

    if (needScroll) {
      menuRef.current.element.list?.scrollTo({ top: groupThreshold });
    }

    setGroupElement(null);
  }, [groupElement]);

  useEffect(() => {
    handleFocusInput();
  }, [values, handleFocusInput]);

  /* references */
  useImperativeHandle(ref, () => ({
    instance: menuRef.current?.element,
    submit: handleSubmit,
  }));

  /**
   * rendered
   */


  const renderedGroups = useMemo(() => {
    if (!groups.length && !loading) {
      return (
        <SelectorGroup
          ItemComponent={SelectorItemMulti}
          blankMessage='Empty Data'
          items={[]}
          name='All Values'
          validateDisabledItem={validateDisabledItem}
          validateLimitExceeded={validateLimitExceeded}
          validateSelectedItem={validateSelectedItem}
          onClickItem={handleClickItem}
          onClickName={handleClickName}
        />
      );
    }

    return groups.map(([name, groupItems]) => (
      <SelectorGroup
        key={name}
        ItemComponent={SelectorItemMulti}
        collapseCount={getCollapseCountOf(name)}
        disableGroupSelect={limitCount ? groupItems.length > limitCount - values.length : undefined}
        groupMessage={getGroupMessage ? getGroupMessage(name) : undefined}
        groupSelect={enableGroupSelect}
        groupSelectDisableMessage={groupDisableMessage}
        items={groupItems}
        name={name}
        validateDisabledItem={validateDisabledItem}
        validateLimitExceeded={validateLimitExceeded}
        validateSelectedItem={validateSelectedItem}
        onClickItem={handleClickItem}
        onClickName={handleClickName}
        onCollapse={handleCollapse}
        onHover={handleSetDescription}
      />
    ));
  }, [
    groups,
    getCollapseCountOf,
    limitCount,
    values,
    loading,
    enableGroupSelect,
    groupDisableMessage,
    getGroupMessage,
    validateDisabledItem,
    validateSelectedItem,
    validateLimitExceeded,
    handleClickItem,
    handleClickName,
    handleCollapse,
    handleSetDescription,
  ]);

  return (
    <SelectorMenu
      ref={menuRef}
      description={descriptionTooltip}
      isFetching={isFetching}
      left={left}
      loading={loading}
      placeholder={selectorPlaceholder}
      right={right}
      searchQuery={searchQuery}
      top={top}
      onCancel={onCancel}
      onHover={handleSetDescription}
      onScroll={handleScroll}
      onSearch={onSearch}
      onSubmit={handleSubmit}
      onUpdateSearchQuery={handleChangeSearchQuery}
    >
      {searchQuery ? (
        <>
          {enableFreeform && (
            <SelectorGroup
              ItemComponent={SelectorItemMulti}
              enableFreeform={enableFreeform}
              items={[{ value: searchQuery, label: searchQuery }]}
              name='Add Freeform'
              validateSelectedItem={validateSelectedItem}
              onClickItem={handleClickFreeformItem}
            />
          )}

          <SelectorGroup
            ItemComponent={SelectorItemMulti}
            blankMessage='Empty Search Results'
            disableGroupSelect={limitCount ? searchedItems.length > limitCount - values.length : undefined}
            freeformValues={freeformValues}
            groupSelectDisableMessage={groupDisableMessage}
            highlightText={searchQuery}
            isLoading={isFetching}
            items={searchedItems}
            name='Search Results'
            validateDisabledItem={validateDisabledItem}
            validateLimitExceeded={validateLimitExceeded}
            validateSelectedItem={validateSelectedItem}
            onClickItem={handleClickItem}
            onHover={handleSetDescription}
          />
        </>
      ) : (
        <>
          {!!values.length && (
            <SelectorGroup
              ItemComponent={SelectorItemMulti}
              freeformValues={freeformValues}
              items={selectedItems}
              name={`Selected (${values.length})`}
              style={styles.selectedGroupHeader}
              validateDisabledItem={validateDisabledItem}
              validateLimitExceeded={validateLimitExceeded}
              validateSelectedItem={validateSelectedItem}
              onClickItem={handleClickItem}
              onHover={handleSetDescription}
            />
          )}

          {!isFetching && renderedGroups}
        </>
      )}
    </SelectorMenu>
  );
});

export default MultiSelectorMenu;
