import { useState, useEffect } from "react";
import "./Toast.css";

let toastHandler = null;

export const showToast = (message, type = "success", duration = 3500) => {
  if (toastHandler) {
    toastHandler(message, type, duration);
  } else {
    console.log(`[Toast ${type}]:`, message);
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastHandler = (message, type, duration) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    return () => {
      toastHandler = null;
    };
  }, []);

  return (
    <div className="toast-portal">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" && "✅"}
            {toast.type === "error" && "⚠️"}
            {toast.type === "info" && "ℹ️"}
          </span>
          <span className="toast-text">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
