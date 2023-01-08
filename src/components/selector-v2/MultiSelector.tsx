import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import MultiSelectorMenu from './MultiSelector.Menu';

import * as types from './Selector.types';
import * as styles from './Selector.styles';

export type Props = {
  TriggerComponent: React.FC<types.ButtonProp>;
  containerStyle?: any;
  initialOpen?: boolean;
  selectorPlaceholder?: string;

  items: types.Item[];
  values: string[];

  loading?: boolean;
  disabledValues?: string[];
  collapseCount?: number;
  collapseWhitelist?: string[] | ((name: string) => boolean);

  groupDisableMessage?: string;

  enableFreeform?: boolean;
  enableGroupSelect?: boolean;
  enableInfiniteScroll?: boolean;
  getGroupMessage?(targetGroup: string): string;

  limitCount?: number;

  top?: number;
  left?: number;

  hasDescription?: boolean;

  submitMode?: 'submit' | 'leave';

  onChange(values: string[]): void;
  onSync?({ prevValues, selectValues }: {
    prevValues?: string[];
    selectValues: string[];
  }): string[];

  onOpen?(): void;
  onClose?(): void;

  onScrollEnd?(): void;
  onSearch?(e: React.ChangeEvent<HTMLInputElement>): void;
};

const MultiSelector = ({
  TriggerComponent,
  containerStyle,
  initialOpen,
  onChange,
  onOpen,
  onClose,
  left: propLeft,
  submitMode = 'submit',
  ...props
}: Props) => {
  const menuRef = useRef<types.MenuReference>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = containerRef.current?.getBoundingClientRect();

  const isMenuOutside = window.innerWidth < ((containerRect?.left ?? 0) + 340);

  const left = isMenuOutside ? undefined : propLeft;
  const right = isMenuOutside ? (propLeft ?? 0) : undefined;

  const [isOpen, setOpen] = useState(initialOpen ?? false);

  const handleClickTrigger = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;

      if (next) {
        onOpen?.();
      } else {
        onClose?.();
      }

      return next;
    });
  }, [onClose, onOpen]);

  const handleChange = useCallback((nextValues: string[]) => {
    setOpen(false);
    onClose?.();
    onChange(nextValues);
  }, [onClose, onChange]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);


  /* event handlers */
  const handleClose = useCallback(() => {
    if (submitMode === 'leave') {
      menuRef?.current?.submit();
      return;
    }

    setOpen(false);
    onClose?.();
  }, [onClose, submitMode]);

  const clickEventListener = useCallback((event: MouseEvent) => {
    const { tooltip } = menuRef.current?.instance ?? {};
    const container = containerRef.current;

    if (!isOpen || !container) {
      return;
    }

    if (!event.clientX && !event.clientY) {
      return;
    }

    const clickedElement = event.target as Element;
    if (!clickedElement) {
      return;
    }

    const isClickedOnInside = container.contains(clickedElement);
    if (isClickedOnInside) {
      return;
    }

    const isClickedOnTooltip = tooltip && tooltip?.contains(clickedElement);
    if (isClickedOnTooltip) {
      return;
    }

    handleClose();
  }, [handleClose, isOpen]);


  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return () => null;
    }

    document.addEventListener('click', clickEventListener, { capture: true });

    return () => {
      document.removeEventListener('click', clickEventListener, { capture: true });
    };
  }, [
    submitMode,
    isOpen,
    onClose,
    clickEventListener,
  ]);

  useEffect(() => {
    if (initialOpen) {
      onOpen?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOpen]);

  useEffect(() => () => {
    setOpen(false);
    onClose?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      css={[styles.container, containerStyle]}
    >
      <TriggerComponent
        isOpened={isOpen}
        onClick={handleClickTrigger}
      />

      {isOpen && (
        <MultiSelectorMenu
          {...props}
          ref={menuRef}
          left={left}
          right={right}
          onCancel={handleCancel}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default MultiSelector;
