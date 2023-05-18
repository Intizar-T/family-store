import { Box, Menu, MenuItem, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import ProductContext from "../product/ProductContext";
import FetchProductList from "../product/FetchProductList";
import useLoading from "../helpers/useLoading";
import { useTranslation, withTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import { changeLanguage } from "../localization/initLocalization";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { USER_URL } from "../api/APIs";

function Header() {
  const { t } = useTranslation();
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
          paddingX: 1,
          paddingY: 1,
        }}
      >
        <Box>
          <Button
            onClick={async () => {
              toggle(true);
              setProducts(await FetchProductList());
              toggle(false);
            }}
          >
            {t("store")}
          </Button>
        </Box>
        <Box>
          <Button size="small" sx={{ ml: 2 }} variant="outlined">
            {user?.name || "Profile"}
          </Button>
          <Button
            onClick={handleClick}
            sx={{
              px: 0,
            }}
          >
            <LanguageIcon />
          </Button>
        </Box>
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
          onClick={async () => {
            if (user == null) return;
            handleClose();
            changeLanguage("en");
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                name: user.name,
                device: user.device,
                language: "en",
              }),
            });
          }}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (user == null) return;
            handleClose();
            changeLanguage("charjew");
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                name: user.name,
                device: user.device,
                language: "charjew",
              }),
            });
          }}
        >
          Charjew
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (user == null) return;
            handleClose();
            changeLanguage("ru");
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                name: user.name,
                device: user.device,
                language: "ru",
              }),
            });
          }}
        >
          Русский
        </MenuItem>
      </Menu>
      {/* {deleteAccountModal && (
        <DeleteAccount handleClose={() => showDeleteAccountModal(false)} />
      )}
      {editAccountModal && (
        <EditAccount handleClose={() => showEditAccountModal(false)} />
      )} */}
      {/* <Loading /> */}
    </React.Fragment>
  );
}

export default withTranslation()(Header);
