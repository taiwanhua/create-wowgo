import { useState } from "react";

export function CounterButton(): JSX.Element {
  const [count, setCount] = useState(0);

  const divStyle = {
    background: `rgba(0,0,0,0.05)`,
    borderRadius: `8px`,
    padding: "1.5rem",
    fontWeight: 500,
  };

  const pStyle = { margin: "0 0 1.5rem 0" };
  const codeStyle = {
    padding: "0.2rem 0.3rem",
    background: `rgba(0,0,0,0.1)`,
    borderRadius: "0.25rem",
  };
  const buttonStyle = {
    background: "black",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    display: "inline-block",
    cursor: "pointer",
  };

  return (
    <div style={divStyle}>
      <p style={pStyle}>
        This component is from <code style={codeStyle}>ui</code>
      </p>
      <div>
        <button
          onClick={() => {
            setCount((c) => c + 1);
          }}
          style={buttonStyle}
          type="button"
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}
