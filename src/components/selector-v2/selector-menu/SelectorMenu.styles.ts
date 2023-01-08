import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { colors } from '@airbridge/component';

export const Wrapper = styled.div<{
  top?: number;
  left?: number;
  right?: number;
  width?: number | 'block';
  tooltipWidth?: number;
}>(({
  top,
  left,
  right,
  width,
  tooltipWidth = 0,
}) => `
  display: flex;
  position: absolute;

  z-index: 202;

  height: fit-content;

  ${width === 'block' ? `
    width: 100%;
  ` : ''}

  ${tooltipWidth ? `
    flex-direction: row-reverse;
  ` : ''}

  ${top !== undefined ? `
    top: ${top}px;
  ` : ''};

  ${left !== undefined ? `
    left: ${left}px;
  ` : ''};

  ${right !== undefined ? `
    right: ${right}px;
  ` : ''};

  ${left === undefined && right === undefined && tooltipWidth ? `
    left: ${-tooltipWidth}px;
  ` : ''}

  margin-top: 2px;

  &:after {
    content: '';

    display: flex;
    flex-flow: nowrap row;

    height: 20px;
  }
`);

export const blockWrapper = css`
  width: 100%;
`;

export const container = css`
  display: flex;
  flex-flow: nowrap column;

  height: fit-content;
  width: 100%;

  position: relative;

  background-color: white;
  border: 1px solid ${colors.lightGray[500]};
  border-radius: 3px;

  ::before {
    display: block;
    width: 100%;
    height: 100%;

    position: absolute;
    z-index: -1;

    content: '';
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.06), 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const header = css`
  padding: 10px 10px 4px 10px;
`;

export const groups = css`
  display: flex;
  flex-flow: nowrap column;

  max-height: 420px;
  overflow: auto;
`;

export const loading = css`
  display: flex;
  flex-flow: nowrap row;
  align-items: center;
  justify-content: center;

  padding: 10px 0;
`;

export const footer = css`
  display: flex;
  flex-flow: nowrap row;
  justify-content: flex-end;

  padding: 10px;

  & > button {
    margin-left: 4px;
  }
`;

export const cancelButton = css`
  min-width: 60px;
`;
