import React, { createContext, useContext, useState, useEffect } from "react";

const StackBuilderContext = createContext(null);

export function StackBuilderProvider({ children }) {
  const [stack, setStack] = useState(() => {
    try {
      const saved = localStorage.getItem("csc_architecture_stack");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("csc_architecture_stack", JSON.stringify(stack));
    } catch (e) {
      console.error("Failed to save stack to localStorage:", e);
    }
  }, [stack]);

  const addToStack = (item) => {
    if (!stack.some((i) => i.id === item.id)) {
      setStack((prev) => [...prev, item]);
    }
  };

  const removeFromStack = (id) => {
    setStack((prev) => prev.filter((i) => i.id !== id));
  };

  const clearStack = () => setStack([]);

  const isInStack = (id) => stack.some((i) => i.id === id);

  const unifiedTerraform = stack
    .map((i) => `# --- ${i.title} (${i.id}) ---\n${i.terraform}`)
    .join("\n\n");

  const unifiedRego = `package enterprise.cloud_security.stack

import rego.v1

default allow := false

${stack
  .map(
    (i) =>
      `# Rule from ${i.id}: ${i.title}\n${(i.opa_policy || "").replace(/^package [^\n]+\n+/, "")}`
  )
  .join("\n\n")}`;

  return (
    <StackBuilderContext.Provider
      value={{
        stack,
        addToStack,
        removeFromStack,
        clearStack,
        isInStack,
        isOpen,
        setIsOpen,
        unifiedTerraform,
        unifiedRego
      }}
    >
      {children}
    </StackBuilderContext.Provider>
  );
}

export function useStackBuilder() {
  const context = useContext(StackBuilderContext);
  if (!context) {
    throw new Error("useStackBuilder must be used within a StackBuilderProvider");
  }
  return context;
}
