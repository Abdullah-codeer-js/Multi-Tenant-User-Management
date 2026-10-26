
export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  icon = null,
  autoComplete,
  minLength,
  maxLength,
  ...rest
}) {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      width: "100%",
      marginBottom: "16px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      boxSizing: "border-box",
      padding: "0 12px",
      border: `1px solid ${error ? "#dc2626" : "#d1d5db"}`,
      borderRadius: "8px",
      backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    icon: {
      display: "flex",
      alignItems: "center",
      color: "#6b7280",
    },
    input: {
      flex: 1,
      width: "100%",
      minWidth: 0,
      padding: "12px 0",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      color: "#111827",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    error: {
      color: "#dc2626",
      fontSize: "12px",
      marginTop: "-2px",
    },
  };

  return (
    <div style={styles.container}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label}
          {required && (
            <span style={{ color: "#dc2626" }}> *</span>
          )}
        </label>
      )}

      <div style={styles.inputWrapper}>
        {icon && <span style={styles.icon}>{icon}</span>}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          style={styles.input}
          {...rest}
        />
      </div>

      {error && (
        <span id={`${name}-error`} style={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
