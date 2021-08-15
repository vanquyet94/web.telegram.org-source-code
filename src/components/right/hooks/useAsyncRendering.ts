import { useEffect, useRef } from '../../../lib/teact/teact';

import useOnChange from '../../../hooks/useOnChange';
import useForceUpdate from '../../../hooks/useForceUpdate';

export default function useAsyncRendering<T extends any[]>(dependencies: T, delay?: number) {
  const isDisabled = delay === undefined;
  const shouldRenderRef = useRef(isDisabled);
  const timeoutRef = useRef<number>();
  const forceUpdate = useForceUpdate();

  useOnChange(() => {
    if (isDisabled) {
      return;
    }

    shouldRenderRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, dependencies);

  useEffect(() => {
    if (isDisabled || shouldRenderRef.current) {
      return;
    }

    const exec = () => {
      shouldRenderRef.current = true;
      forceUpdate();
    };

    if (delay! > 0) {
      timeoutRef.current = window.setTimeout(exec, delay);
    } else {
      exec();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return shouldRenderRef.current;
}
