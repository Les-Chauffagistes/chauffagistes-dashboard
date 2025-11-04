import { Tooltip, IconButton } from "@mui/material";
import { Info } from "lucide-react";


export function HeaderWithInfo({ displayName, tooltip }: { displayName: string; tooltip: string }) {
  return (
    <div className="custom-header">
      <span>{displayName}</span>
      <Tooltip title={tooltip} arrow placement="top">
        <IconButton size="large" sx={{ p: 0, ml: 1, minWidth: 16 }} className="custom-header-icon">
          <Info size="16px" />
        </IconButton>
      </Tooltip>
    </div>
  );
}