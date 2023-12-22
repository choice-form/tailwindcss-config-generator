import cx from 'classnames';
import { twMerge } from 'tailwind-merge';

export const tcx = (...args: cx.ArgumentArray) => {
  return twMerge(cx(args));
};
