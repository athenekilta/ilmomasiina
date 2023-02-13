import React, {
  MouseEvent, ReactNode, useCallback, useEffect, useState,
} from 'react';

import { Button, ButtonProps } from 'react-bootstrap';

type Props = ButtonProps & {
  /** The interval within which the button must be repressed. */
  confirmDelay?: number
  /** The button contents shown when waiting for a confirmation press. */
  confirmLabel?: ReactNode
};

/** Button that requires pressing twice within a given interval. */
export default function ConfirmButton({
  confirmDelay,
  confirmLabel,
  onClick,
  children,
  ...props
}: Props) {
  const [confirming, setConfirming] = useState(false);

  // When confirming is set, clear it after the delay.
  useEffect(() => {
    if (confirming) {
      const timer = setTimeout(() => setConfirming(false), confirmDelay);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [confirming, confirmDelay]);

  const handler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (confirming || !confirmDelay) {
        setConfirming(false);
        onClick?.(e);
      } else {
        e.preventDefault();
        setConfirming(true);
      }
    },
    [confirming, confirmDelay, onClick],
  );

  return (
    <Button onClick={handler} {...props}>
      {confirming ? confirmLabel ?? children : children}
    </Button>
  );
}
