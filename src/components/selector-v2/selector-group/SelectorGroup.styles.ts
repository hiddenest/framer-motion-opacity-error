import { css } from '@emotion/react';
import { css as pureCss } from '@emotion/css';
import styled from '@emotion/styled';

import { colors, Checkbox as AirbridgeCheckbox, typography } from '@airbridge/component';

export const container = (hasItems = false) => css`
  position: relative;

  display: flex;
  flex-flow: nowrap column;

  &:after {
    content: '';
    margin-top: 10px;
  }

  &:not(:last-of-type):after {
    ${hasItems ? `
      height: 1px;
      width: calc(100% - 24px);
      box-sizing: border-box;

      background-color: ${colors.lightGray[400]};

      margin: 10px auto 0 auto;
    ` : ''}
  }
`;

export const stickyDetector = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  height: 1px;
`;

export const side = css`
  display: flex;
  flex-flow: nowrap row;

  padding: 10px 12px;
`;

export const headerName = css`
  line-height: 20px;
  text-align: left;

  font-size: ${typography.size[200]};
  color: ${colors.darkGray[400]};
`;

export const clickableHeaderName = (disabled: boolean) => css`
  line-height: 20px;
  text-align: left;

  font-size: ${typography.size[300]};

  ${disabled ? `
    color: ${colors.darkGray[100]};
  ` : `
    color: ${colors.darkGray[600]};
  `};
`;

export const nameGroup = (disabled: boolean) => css`
  display: flex;
  flex-flow: nowrap row;
  align-items: center;

  flex: 1;

  padding: 8px 12px;

  ${disabled ? `
    cursor: not-allowed;
  ` : ''};
`;

export const sideButton = css`
  color: ${colors.blue[600]};
  font-size: ${typography.size[200]};
  line-height: 20px;

  &:hover {
    transition: .3s all ease;
    color: ${colors.blue[400]};
  }
`;

export const disableSideButton = css`
  cursor: not-allowed;
  color: ${colors.darkGray[100]} !important;
`;

export const items = css`
  display: flex;
  flex-flow: nowrap column;
`;

export const guideLabel = css`
  color: ${colors.darkGray[400]};
  font-size: ${typography.size[300]};
  line-height: 18px;

  padding: 6px 20px;
`;

export const blankMessage = css`
  color: ${colors.darkGray[100]};
  font-size: ${typography.size[300]};
  line-height: 18px;

  padding: 0 12px 0 12px;
`;

export const checkboxWrapper = css`
  pointer-events: none;
`;

export const Checkbox = styled(AirbridgeCheckbox)`
  &+label {
    display: flex;
    flex-flow: nowrap row;
    align-content: center;

    height: 20px;
  }
`;

export const hiddenTooltip = pureCss`
  display: none;
`;

// pureCss

export const tooltipContainer = pureCss`
  flex: 1;

  & > .ab-tooltip-button {
    margin: 0;
    width: 100%;
  }
`;

export const tooltipTriggerContainer = pureCss`
  display: flex;
  width: 100%;
`;

export const header = (isSticky: boolean) => css`
  position: sticky;
  top: 0;
  cursor: default;

  z-index: ${isSticky ? '101' : '100'};

  display: flex;
  flex-flow: nowrap row;
  justify-content: space-between;

  background-color: ${colors.white};
`;

export const clickableHeader = css`
  &:hover {
    background-color: ${colors.lightGray[200]};
  }
`;

export const bottomShadowOfHeader = css`
  box-shadow: 0px 0px 6px 3px rgb(0 0 0 / 3%);
`;

export const headerGroup = css`
  display: flex;
  flex-flow: nowrap row;
  align-content: center;
  flex-shrink: 0;

  padding: 10px 12px;
  text-align: left;

  color: ${colors.darkGray[100]};
`;

export const clickableHeaderGroup = css`
  flex: 1;
`;

export const enableHeaderGroup = css`
  color: ${colors.darkGray[400]};
`;

export const disableHeaderGroup = css`
  cursor: not-allowed;
`;

export const headerLabel = css`
  color: ${colors.darkGray[400]};
  font-size: ${typography.size[200]};
  line-height: 20px;
`;

export const clickableHeaderLabel = css`
  color: ${colors.darkGray[500]};
  font-size: ${typography.size[300]};
  word-break: keep-all;
`;

export const disableHeaderLabel = css`
  color: ${colors.darkGray[100]};
`;
