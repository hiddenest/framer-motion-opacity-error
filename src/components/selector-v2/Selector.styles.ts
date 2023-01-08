import { css } from '@emotion/react';

import { colors, typography } from '@airbridge/component';

export const container = css`
  position: relative;
`;

export const selectedGroupHeader = css`
  &:not(:last-child):after {
    width: 100%;
    margin: 10px 0 0 0;
  }
`;

export const clearSideButton = css`
  color: ${colors.blue[600]};
  font-size: ${typography.size[200]};

  transition: color .3s ease;

  &:hover {
    color: ${colors.blue[400]};
  }
`;

export const selectAllSideButton = css`
  color: ${colors.blue[600]};
  font-size: ${typography.size[200]};

  transition: color .3s ease;

  &:hover {
    color: ${colors.blue[400]};
  }
`;

export const disabledSideButton = css`
  color: ${colors.darkGray[100]};
  font-size: ${typography.size[200]};

  cursor: pointer;
`;
