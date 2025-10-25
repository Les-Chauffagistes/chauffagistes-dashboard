import { useState } from "react";
import { Settings } from "lucide-react";
import "./toolbar.css"; // styles séparés

type ToolbarProps = {
  options: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }[];
};

export function Toolbar({ options }: ToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="toolbar-container">
      <button
        className="toolbar-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Afficher les options"
      >
        <Settings />
      </button>

      <div className={`toolbar-panel ${open ? "open" : ""}`}>
        {options.map((opt) => (
          <label key={opt.id} className="toolbar-option">
            <input
              type="checkbox"
              checked={opt.checked}
              onChange={(e) => opt.onChange(e.target.checked)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}