import React, { useCallback } from 'react';

import * as types from '../Selector.types';
import * as styles from './SelectorItemMulti.styles';

const SelectorItemMulti = ({
  isFreeform = false,
  value,
  label,
  item,
  disabled,
  selected,
  onClick,
  onHover,
}: types.ItemProp) => {
  const handleClickItem = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(value);
  }, [value, onClick]);

  const handleSetDescription = useCallback(() => {
    onHover?.(item);
  }, [item, onHover]);

  return (
    <button
      css={styles.container(disabled)}
      type='button'
      onClick={disabled ? undefined : handleClickItem}
      onFocus={() => { }}
      onMouseOver={handleSetDescription}
    >
      <styles.Checkbox
        disabled={disabled}
        isChecked={selected}
        name={value}
      />

      <div css={styles.triggerContentWrapper}>
        <span className={styles.labelCss}>{label}</span>
        {(isFreeform) && (
          <span className={styles.freeform}>(Freeform)</span>
        )}
      </div>
    </button>
  );
};

export default React.memo<types.ItemProp>(SelectorItemMulti as React.FC);
