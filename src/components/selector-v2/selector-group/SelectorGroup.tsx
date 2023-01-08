import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Icon } from '@airbridge/component';

import { bottomShadowOfHeader } from './SelectorGroup.styles';

import * as types from '../Selector.types';
import * as styles from './SelectorGroup.styles';

type Prop = {
  ItemComponent: React.FC<types.ItemProp>;

  items: types.Item[];

  enableFreeform?: boolean;
  collapseCount?: number;
  blankMessage?: string;
  groupSelectDisableMessage?: string;
  groupMessage?: string;
  highlightText?: string;
  isLoading?: boolean;

  sideButton?: React.ReactNode;

  name: string;
  groupSelect?: boolean;
  disableGroupSelect?: boolean;

  freeformValues?: string[];

  style?: any;

  validateSelectedItem(item: types.Item): boolean;
  validateDisabledItem?(item: types.Item): boolean;
  validateLimitExceeded?(): boolean;

  onClickName?(name: string): void;
  onClickItem(value: string): void;
  onCollapse?(menuElement: HTMLDivElement): void;
  onHover?(item: types.Item | null): void;
};

const SelectorGroup = ({
  ItemComponent,
  items,
  enableFreeform = false,
  collapseCount,
  blankMessage,
  freeformValues = [],
  groupSelectDisableMessage,
  groupMessage,
  highlightText,
  isLoading = false,
  sideButton,
  name,
  groupSelect,
  disableGroupSelect,
  style,
  validateSelectedItem,
  validateDisabledItem,
  validateLimitExceeded,
  onClickName,
  onClickItem,
  onCollapse,
  onHover,
}: Prop) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const detectorRef = useRef<HTMLDivElement>(null);

  const t = (text: string) => text;

  const [isSticky, setSticky] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const enableCollapse = useMemo(() => (
    collapseCount !== undefined &&
    collapseCount > 0 &&
    items.length - collapseCount > 0
  ), [collapseCount, items]);

  const isSelectedAllItems = useMemo(() => (
    items.every(item => validateSelectedItem(item))
  ), [items, validateSelectedItem]);

  const isSelectedSomeItems = useMemo(() => (
    items.some(item => validateSelectedItem(item))
  ), [items, validateSelectedItem]);

  const escapeRegExp = useCallback((str: string) => (
    // $& = 일치하는 모든 문자열
    // eslint-disable-next-line no-useless-escape
    str.replace(/[.*+?^${}()\/|[\]\\]/g, '\\$&')
  ), []);

  const handleClickName = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onClickName?.(name);
  }, [name, onClickName]);

  const handleClickExpand = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setExpanded((prev) => {
      if (prev) {
        if (!containerRef.current) {
          return !prev;
        }

        onCollapse?.(containerRef.current);
      }

      return !prev;
    });
  }, [onCollapse]);

  const handleSetDescription = useCallback(() => {
    onHover?.(null);
  }, [onHover]);

  const filteredItems = useMemo(() => (
    expanded ? items : [...items].slice(0, collapseCount)
  ), [expanded, items, collapseCount]);

  useEffect(() => {
    const element = detectorRef.current;
    if (!element) {
      return () => {};
    }

    const observer = new IntersectionObserver(([event]) => {
      setSticky(event.intersectionRatio < 1);
    }, { threshold: [1] });

    if (detectorRef.current !== undefined) {
      observer.observe(element);
    }

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!items.length) {
      onHover?.(null);
    }
  }, [items.length, onHover]);

  return (
    <div
      ref={containerRef}
      className='SelectorGroup__container'
      css={[styles.container(!!items.length), style]}
    >
      <div
        ref={detectorRef}
        css={styles.stickyDetector}
      />

      <div
        className='SelectorGroup__header'
        css={[
          styles.header(isSticky),
          groupSelect && styles.clickableHeader,
          isSticky && bottomShadowOfHeader,
        ]}
      >
        <div css={styles.headerGroup}>
          <p css={styles.headerLabel}>{name}</p>
        </div>

        {sideButton && (
          <div css={styles.headerGroup}>
            {sideButton}
          </div>
        )}
      </div>

      <div css={styles.items}>
        {filteredItems.map((item) => {
          const isSelected = validateSelectedItem(item);
          const isLimitExceeded = validateLimitExceeded?.();
          const isDisabled = (
            !isSelected &&
            validateDisabledItem?.(item)
          ) ?? false;

          return (
            <ItemComponent
              key={`${name}/${item.value}`}
              ariaLabelMessage={isLimitExceeded ? undefined : item.ariaLabel}
              disabled={isDisabled}
              disabledMessage={groupSelectDisableMessage}
              highlightText={escapeRegExp(highlightText ?? '')}
              isFreeform={enableFreeform || freeformValues?.includes(item.value)}
              item={item}
              label={item.label}
              selected={isSelected}
              tooltipMessage={isLimitExceeded ? undefined : item.tooltip}
              value={item.value}
              onClick={onClickItem}
              onHover={onHover}
            />
          );
        })}

        {(
          blankMessage &&
          !items.length &&
          !isLoading
        ) && (
          <p css={styles.blankMessage}>{blankMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SelectorGroup;
