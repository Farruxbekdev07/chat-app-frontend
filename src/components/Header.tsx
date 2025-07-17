import {
  Box,
  Menu,
  Avatar,
  Toolbar,
  Tooltip,
  MenuItem,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import theme from "src/theme";
import UserStatus from "./UserStatus";
import { RootState } from "src/redux/store";
import { deleteChatWithUser } from "src/hooks/users";
import { clearSelectedUser } from "src/redux/messagesSlice";
import { getDatabase, onValue, ref } from "firebase/database";

const Header = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleCloseDrawer = () => {
    dispatch(clearSelectedUser());
  };

  const handleDeleteChatWithUser = async () => {
    await deleteChatWithUser(currentUser?.uid || "", selectedUser?.uid || "");
    dispatch(clearSelectedUser());
  };

  useEffect(() => {
    const db = getDatabase();
    const statusRef = ref(db, `/status/${selectedUser?.uid}`);

    onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      console.log(`${selectedUser?.fullName} is now ${status?.state}`);
    });
  }, [selectedUser]);

  if (!selectedUser) return null;

  return (
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isMobile && (
          <IconButton color="inherit" onClick={handleCloseDrawer}>
            <ArrowBackIcon />
          </IconButton>
        )}

        <Avatar>{selectedUser.fullName[0]}</Avatar>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {selectedUser.fullName}
          </Typography>
          <UserStatus />
        </Box>
      </Box>

      <Box>
        <Tooltip title="Settings">
          <IconButton onClick={handleOpenUserMenu}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleDeleteChatWithUser}>
            <Typography textAlign="center" color="error">
              Delete chat
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
};

export default Header;
