import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useId,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";

interface UiDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trigger: React.ReactNode;
  children?: React.ReactNode;
  triggerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

const UiDialog = ({
  isOpen,
  setIsOpen,
  trigger,
  children,
  triggerClassName,
  className,
  style,
}: UiDialogProps) => {
  const {refs, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, {outsidePressEvent: "mousedown"});

  const {getReferenceProps, getFloatingProps} = useInteractions([click, role, dismiss]);

  const headingId = useId();
  const descriptionId = useId();

  return (
    <>
      <div className={triggerClassName} ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
            lockScroll
          >
            <FloatingFocusManager context={context}>
              <div
                className={className}
                style={style}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default UiDialog;
