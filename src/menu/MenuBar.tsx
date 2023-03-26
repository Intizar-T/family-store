import { Settings } from "@mui/icons-material";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import React, { useContext, useState } from "react";
import UserContext from "../UserContext";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DeleteAccount from "./DeleteAccount";
import useLoading from "../helpers/useLoading";

export default function MenuBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteAccountModal, showDeleteAccountModal] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: 1,
        }}
      >
        <Typography variant="button" color="#1976d2">
          Tashovs' Store
        </Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user != null ? user.name[0].toUpperCase() : "P"}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon style={{ minWidth: 25 }}>
            <Settings fontSize="small" color="success" />
          </ListItemIcon>
          Akkaunt uytgat
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            showDeleteAccountModal(true);
          }}
        >
          <ListItemIcon style={{ minWidth: 25 }}>
            <DeleteForeverOutlinedIcon fontSize="small" color="error" />
          </ListItemIcon>
          Udalit et
        </MenuItem>
      </Menu>
      {deleteAccountModal && (
        <DeleteAccount handleClose={() => showDeleteAccountModal(false)} />
      )}
      <Loading />
    </React.Fragment>
  );
}
