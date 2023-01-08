import React, {
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';

import { colors, Button, Icon, InputField } from '@airbridge/component';

import type * as types from '../Selector.types';
import * as styles from './SelectorMenu.styles';


type Props = {
  children: React.ReactNode;
  placeholder?: string;

  description?: types.Item | null;

  isFetching?: boolean;
  loading?: boolean;

  top?: number;
  left?: number;
  right?: number;
  width?: number | 'block';

  searchQuery: string;

  onSubmit?(): void;
  onCancel?(): void;

  onHover?(item: types.Item | null): void;
  onUpdateSearchQuery(nextSearchQuery: string): void;

  onSearch?: React.ChangeEventHandler<HTMLInputElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
};

const getWidth = (width?: 'block' | number) => {
  if (width === undefined) {
    return 330;
  }

  if (width === 'block') {
    return '100%';
  }

  return width;
};

const SelectorMenu = React.forwardRef<types.SelectorMenuReference, Props>((props, ref) => {
  const {
    children,
    description,
    placeholder,
    isFetching = false,
    loading,
    top,
    left,
    right,
    width,
    searchQuery,
    onUpdateSearchQuery,
    onScroll,
    onSubmit,
    onHover,
    onCancel,
    onSearch,
  } = props;

  const t = (key: string) => key;

  const menuRef = useRef<HTMLDivElement>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchElementRef = useRef<HTMLInputElement>(null);

  const containerRect = containerRef.current?.getBoundingClientRect();

  const isTooltipOutside = (
    !!description &&
    window.innerWidth < (containerRect?.right ?? 0) + 262
  );

  const handleChangeSearchQuery = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (onSearch) {
      onSearch(event);
    }

    onUpdateSearchQuery(event.target.value);
  }, [onUpdateSearchQuery, onSearch]);

  const handleSubmit = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onSubmit?.();
  }, [onSubmit]);

  const handleCancel = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onCancel?.();
  }, [onCancel]);

  // [ABRDE-225] 이번 티켓에서 mouse leave 하는 경우 tooltip 제거는 제외하고 작업
  // const handleDebounceMouseMove = useMemo(() => debounce((e: MouseEvent) => {
  //   const containerRect = containerRef.current?.getBoundingClientRect();

  //   if (!(checkCursorPosition(e, containerRect) || checkCursorPosition(e, tooltipRect))) {
  //     onHover?.(null);
  //   }
  // }, 50), [onHover, tooltipRect]);

  useEffect(() => {
    searchElementRef.current?.focus();

    const rect = menuRef.current?.getBoundingClientRect();

    const menuBottom = rect?.bottom ?? 0;

    // Selector 가 스크롤 아래로 넘치는 케이스
    if (menuBottom > window.innerHeight) {
      window.scrollTo({
        top: window.scrollY + menuBottom - window.innerHeight,
      });
    }
  }, []);

  // [ABRDE-225] 이번 티켓에서 mouse leave 하는 경우 tooltip 제거는 제외하고 작업
  // useEffect(() => {
  //   document.addEventListener('mousemove', handleDebounceMouseMove);

  //   return () => {
  //     document.removeEventListener('mousemove', handleDebounceMouseMove);
  //   };
  // }, [handleDebounceMouseMove]);

  useImperativeHandle(ref, () => ({
    ref: {
      container: containerRef,
      list: listRef,
      tooltip: tooltipRef,
    },
    element: {
      container: containerRef.current,
      list: listRef.current,
      tooltip: tooltipRef.current,
    },
  }));

  return (
    <styles.Wrapper
      ref={menuRef}
      left={left}
      right={right}
      tooltipWidth={isTooltipOutside ? 262 : 0}
      top={top}
      width={width}
    >
      <div
        ref={containerRef}
        className='SelectorMenu__container'
        css={styles.container}
        style={{ width: getWidth(width) }}
      >
        <div
          className='SelectorMenu__header'
          css={styles.header}
        >
          <InputField
            ref={searchElementRef}
            placeholder={placeholder ?? 'Search Value'}
            type='search'
            value={searchQuery}
            width='block'
            onChange={handleChangeSearchQuery}
          />
        </div>

        <div
          ref={listRef}
          className='SelectorGroup'
          css={styles.groups}
          onScroll={onScroll}
        >
          {children}

          {(loading || isFetching) && (
            <div css={styles.loading}>
              Spinner
            </div>
          )}
        </div>

        {(onCancel || onSubmit)  && (
          <div
            className='SelectorMenu__footer'
            css={styles.footer}
          >
            {onCancel && (
              <Button
                appearance='ghost'
                css={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}

            {onSubmit && (
              <Button
                intent='accent'
                width={120}
                onClick={handleSubmit}
              >
                Apply
              </Button>
            )}
          </div>
        )}
      </div>
    </styles.Wrapper>
  );
});

export default SelectorMenu;
