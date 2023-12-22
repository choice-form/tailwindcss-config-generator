import cx from "classnames";
import {twMerge} from "tailwind-merge";

const tcx = (...args: cx.ArgumentArray) => {
  return twMerge(cx(args));
};

export default tcx;
