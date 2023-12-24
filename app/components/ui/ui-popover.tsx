import {useState} from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
  FloatingPortal,
  Placement,
} from "@floating-ui/react";

interface UiPopoverProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trigger: React.ReactNode;
  children?: React.ReactNode;
  triggerClassName?: string;
  className?: string;
  placement?: Placement;
  placeOffset?: number;
  portalId?: string;
  style?: React.CSSProperties;
}

const UiPopover = ({
  isOpen,
  setIsOpen,
  trigger,
  children,
  triggerClassName,
  className,
  placement = "bottom",
  placeOffset = 8,
  portalId,
  style,
}: UiPopoverProps) => {
  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    placement: placement,
    onOpenChange: setIsOpen,
    middleware: [offset(placeOffset), flip({fallbackAxisSideDirection: "end"}), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss, role]);

  const headingId = useId();

  return (
    <>
      <div className={triggerClassName} ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </div>

      {isOpen && (
        <FloatingPortal id={portalId}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className={className}
              ref={refs.setFloating}
              style={{...floatingStyles, ...style}}
              aria-labelledby={headingId}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};

export default UiPopover;
