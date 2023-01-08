import React from 'react';

export type Item = {
  value: string;
  label: string;
  group?: string;
  tooltip?: string;
  ariaLabel?: string;
  description?: string;
  example?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
};

export type FilterValueLabel = {
  value: string;
  isFreeform: boolean;
};

/**
 * Helper Props
 */

export type ItemProp = {
  value: string;
  label: string;
  item: Item;

  isFreeform?: boolean;
  selected: boolean;
  disabled: boolean;
  disableGroupSelect?: boolean;

  highlightText?: string;
  tooltipMessage?: string;
  disabledMessage?: string;
  ariaLabelMessage?: string;

  onClick(value: string): void;
  onHover?(item: Item | null): void;
};

export type ButtonProp = {
  isOpened: boolean;
  onClick(event: React.MouseEvent<HTMLElement>): void;
};

export type SelectorMenuReference = {
  ref: {
    container: React.RefObject<HTMLDivElement>;
    list: React.RefObject<HTMLDivElement>;
    tooltip: React.RefObject<HTMLDivElement>;
  };
  element: {
    container: HTMLDivElement | null;
    list: HTMLDivElement | null;
    tooltip: HTMLDivElement | null;
  };
};

export type MenuReference = {
  instance?: SelectorMenuReference['element'];
  submit(): void;
};
