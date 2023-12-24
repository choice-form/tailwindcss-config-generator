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
  trigger: (open: boolean) => React.ReactNode;
  children?: React.ReactNode;
  triggerClassName?: string;
  className?: string;
  placement?: Placement;
}

const UiPopover = ({
  trigger,
  children,
  triggerClassName,
  className,
  placement = "bottom",
}: UiPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    placement: placement,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip({fallbackAxisSideDirection: "end"}), shift()],
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
        {trigger(isOpen)}
      </div>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className={className}
              ref={refs.setFloating}
              style={floatingStyles}
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
