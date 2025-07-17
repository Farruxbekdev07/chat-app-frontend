// src/components/UserStatus.tsx
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useUserStatus } from "src/hooks/useUserStatus";
import { RootState } from "src/redux/store";
import { formatLastSeen } from "src/utils/formatTime";

const UserStatus = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );

  const { isTyping, isOnline, lastSeen } = useUserStatus(
    currentUser?.uid || "",
    selectedUser?.uid || ""
  );

  if (!selectedUser) return null;

  const statusText = isTyping
    ? "typing..."
    : isOnline
    ? "online"
    : formatLastSeen(lastSeen);

  const statusColor = isTyping
    ? "primary"
    : isOnline
    ? "success"
    : "text.disabled";

  return (
    <Typography variant="caption" color={statusColor}>
      {statusText}
    </Typography>
  );
};

export default UserStatus;
