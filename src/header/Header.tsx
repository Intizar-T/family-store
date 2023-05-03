import { Settings } from "@mui/icons-material";
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Button,
} from "@mui/material";
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DeleteAccount from "./DeleteAccount";
import EditAccount from "./EditAccount";
import ProductContext from "../product/ProductContext";
import FetchProductList from "../product/FetchProductList";
import useLoading from "../helpers/useLoading";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteAccountModal, showDeleteAccountModal] = useState(false);
  const [editAccountModal, showEditAccountModal] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { user } = useContext(UserContext);
  const { products, setProducts } = useContext(ProductContext);
  const [Loading, toggle] = useLoading();
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingX: 2,
          paddingY: 1,
        }}
      >
        <Button
          onClick={async () => {
            toggle(true);
            setProducts(await FetchProductList());
            toggle(false);
          }}
        >
          Tashovs' Store
        </Button>
        <Tooltip title="Account settings">
          <Button
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            variant="outlined"
          >
            {user?.name || "Profile"}
          </Button>
        </Tooltip>
      </Box>
      {/* <Menu
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
            showEditAccountModal(true);
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
      {editAccountModal && (
        <EditAccount handleClose={() => showEditAccountModal(false)} />
      )} */}
      <Loading />
    </React.Fragment>
  );
}
