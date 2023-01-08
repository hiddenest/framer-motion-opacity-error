import styled from '@emotion/styled';

export const containerVariants = {
  open: {
    height: 'auto',
  },
  collapsed: {
    height: 0,
    transition: {
      delay: 0,
    },
  },
};

export const contentVariants = {
  open: {
    opacity: 1,
    transition: {
      delayChildren: 0,
    },
  },
  collapsed: {
    opacity: 0,
  },
};

export const Trigger = styled.button(({
  'aria-disabled': disabled,
}) => `
  display: flex;
  width: 100%;
  align-items: center;
  text-align: left;

  .Collapsable__Title {
    flex: 1;
  }

  .Collapsable__Indicator.right {
    margin-left: 5px;
  }

  .Collapsable__Indicator.left {
    margin-right: 2px;
    transition: .3s transform ease;
    
    &.isOpen {
      transform: rotateZ(90deg);
    }
  }

  ${disabled ? `
    cursor: not-allowed;
  ` : ''}
`);
