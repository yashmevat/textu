import React, { useEffect } from "react";
import "../Style/Toast.css"; // Make sure to create this CSS file

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close in 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container ${type}`}>
      {message}
    </div>
  );
};

export default Toast;
