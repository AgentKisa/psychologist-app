// components/Portal.jsx
import { useEffect, useState, createPortal } from "react";

const Portal = ({ children }) => {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      let portalDiv = document.getElementById("modal-root");
      if (!portalDiv) {
        portalDiv = document.createElement("div");
        portalDiv.setAttribute("id", "modal-root");
        document.body.appendChild(portalDiv);
      }
      setPortalRoot(portalDiv);
    }
  }, []);

  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
};

export default Portal;
