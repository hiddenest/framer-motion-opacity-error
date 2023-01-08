import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon, Text } from '@airbridge/component';

import classnames from 'classnames';

import * as styles from './Collapsable.style';

const milli2second = (milli: number) => milli * 0.001;


type Props = {
  children: React.ReactNode;
  title?: React.ReactNode;
  triggerRef?: React.Ref<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  isOpen?: boolean;
  duration?: number;
  iconPosition?: 'left' | 'right';
  onToggle?(
    isOpen: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
  ): void;
  onAnimationComplete?(): void;
};


const Collapsable = ({
  children,
  title = null,
  className = '',
  disabled = false,
  isOpen: propsIsOpen = false,
  duration = 300,
  iconPosition = 'right',
  triggerRef,
  onToggle = () => {},
  onAnimationComplete = () => {},
}: Props) => {
  const [isOpen, setIsOpen] = useState(propsIsOpen);

  const containerTransition = useMemo(() => ({
    duration: milli2second(duration ?? 0),
  }), [duration]);

  const contentTransition = useMemo(() => ({
    duration: milli2second((duration ?? 0) - 100),
  }), [duration]);


  const handleToggle = useCallback((
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setIsOpen((prevIsOpen) => {
      const nextIsOpen = !prevIsOpen;

      if (onToggle) {
        onToggle(nextIsOpen, e);
      }

      return nextIsOpen;
    });
  }, [onToggle]);


  useEffect(() => {
    setIsOpen(propsIsOpen);
  }, [propsIsOpen]);


  return (
    <div
      className={classnames(
        'Collapsable',
        className,
        isOpen && 'Collapsable--opened',
      )}
    >
      {title && (
        <styles.Trigger
          ref={triggerRef}
          aria-disabled={disabled}
          className={classnames(
            'Collapsable__Trigger',
            isOpen && 'Collapsable__Trigger--opened',
          )}
          disabled={disabled}
          type='button'
          onClick={handleToggle}
        >
          {iconPosition === 'left' && (
            <Icon
              className={classnames(
                'Collapsable__Indicator left',
                { isOpen },
              )}
              size={16}
            >
              {'>'}
            </Icon>
          )}
          <span className='Collapsable__Title'>
            {typeof title === 'string' ? (
              <Text size={300}>
                {title}
              </Text>
            ) : title}
          </span>
          {iconPosition === 'right' && (
            <Icon
              className='Collapsable__Indicator right'
              size={16}
            >
              {isOpen ? '⬆️' : '⬇️'}
            </Icon>
          )}
        </styles.Trigger>
      )}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate='open'
            className='Collapsable__Content'
            exit='collapsed'
            initial='collapsed'
            transition={containerTransition}
            variants={styles.containerVariants}
            onAnimationComplete={onAnimationComplete}
          >
            <motion.div
              transition={contentTransition}
              variants={styles.contentVariants}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collapsable;
