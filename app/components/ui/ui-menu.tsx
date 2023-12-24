import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
  Placement,
  FloatingPortal,
} from "@floating-ui/react";

export interface UiMenuProps extends React.HTMLAttributes<HTMLButtonElement> {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  placement?: Placement;
  triggerClassName?: string;
  menuClassName?: string;
  isOpen?: boolean;
  setIsOpen?(isOpen: boolean): void;
  portalElementId?: string;
}

const UiMenu = ({
  trigger,
  children,
  placement = "bottom-end",
  triggerClassName,
  menuClassName,
  isOpen,
  setIsOpen,
  portalElementId,
}: UiMenuProps) => {
  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    placement: placement,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip()],
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
        <FloatingPortal id={portalElementId}>
          <FloatingFocusManager context={context} modal={false}>
            <div
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

export default UiMenu;
