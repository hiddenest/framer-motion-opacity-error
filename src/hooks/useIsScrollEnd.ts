import { useState } from 'react';
import { throttle } from 'lodash';

const useIsScrollEnd = (
  ref: React.RefObject<HTMLElement> | undefined,
  scrollPadding = 0,
  throttleTime = 0,
): [boolean, () => void] => {
  const [isScrollEnd, setIsScrollEnd] = useState<boolean>(false);

  const handleScrollEnd = throttle(() => {
    const dom = ref?.current;

    if (
      dom &&
      dom.scrollHeight - dom.scrollTop - scrollPadding <= dom.clientHeight
    ) {
      setIsScrollEnd(true);
    } else {
      setIsScrollEnd(false);
    }
  }, throttleTime);

  return [isScrollEnd, handleScrollEnd];
};

export default useIsScrollEnd;
