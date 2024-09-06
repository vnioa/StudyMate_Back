function InputField({ type, name, placeholder, value, onChange, rightElement }) {
  return (
    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
      />
      {rightElement && (
        <div style={{ marginLeft: '8px' }}>
          {rightElement}
        </div>
      )}
    </div>
  );
}

export default InputField;
