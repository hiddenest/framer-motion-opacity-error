import { css } from '@emotion/react';
import { css as pureCss } from '@emotion/css';
import styled from '@emotion/styled';

import { colors, Checkbox as AirbridgeCheckbox, typography } from '@airbridge/component';

export const container = (disabled: boolean) => css`
  position: relative;

  display: flex;
  flex-flow: nowrap row;
  align-items: center;

  flex: 1;

  font-size: ${typography.size[300]};
  line-height: 20px;

  padding: 6px 20px;

  text-align: left;

  color: ${colors.darkGray[600]};

  ${disabled ? `
    & * {
      color: ${colors.darkGray[100]} !important;
    }

    cursor: not-allowed;
  ` : ''};

  &:hover {
    background-color: ${colors.lightGray[200]};
  }
`;

export const labelCss = pureCss`
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;

  line-height: 20px;
  min-height: 20px;

  & > * {
    vertical-align: baseline !important;
  }
`;

export const highlightCss = pureCss`
  color: ${colors.blue[600]};
`;

export const tooltip = pureCss`
  & > .ab-tooltip-button {
    margin: 0;
    width: 100%;

    & > div {
      width: 100%;
    }
  }
`;

export const tooltipContent = pureCss`
  pointer-events: none;
`;

export const hiddenTooltip = pureCss`
  display: none;
`;

export const Checkbox = styled(AirbridgeCheckbox)`
  display: flex;
  align-items: center;
  height: 20px;
  
  &+label {
    display: flex;
    flex-flow: nowrap row;
    align-content: center;

    height: 20px;
  }
`;

export const triggerContainer = pureCss`
  display: flex;
  flex-flow: nowrap row;
`;

export const triggerContentWrapper = css`
  display: flex;
  justify-content: space-between;

  width: 100%;
`;

export const freeform = pureCss`
  flex-shrink: 0;
  color: ${colors.darkGray[100]};
  font-size: ${typography.size[200]};
`;
