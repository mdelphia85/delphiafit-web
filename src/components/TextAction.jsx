/**
 * DelphiaFit action control: accessible clickable text, never a conventional
 * button. Keep the existing page typography/colour via the style prop.
 * Use submit for actions inside a form to preserve native form validation.
 */
export default function TextAction({
  children,
  onClick,
  submit = false,
  disabled = false,
  style = {},
  label,
  ...rest
}) {
  function activate(event) {
    if (disabled) return;
    if (submit) {
      const form = event.currentTarget.closest("form");
      form?.requestSubmit();
    } else {
      onClick?.(event);
    }
  }

  function onKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(event);
    }
  }

  return (
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-label={label}
      onClick={activate}
      onKeyDown={onKeyDown}
      style={{
        color: "inherit",
        textDecoration: "underline",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
