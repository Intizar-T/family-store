import { Tooltip, Button } from "@mui/material";
import { registerServiceWorker } from "../helpers/notificationSubscription";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useContext, useState } from "react";
import UserContext from "../UserContext";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import NotificationConfirmationModal from "../product/NotificationConfirmationModal";

interface BuyPanelFooterProps {
  showCreateModal: (show: boolean) => void;
}

export default function BuyPanelFooter({
  showCreateModal,
}: BuyPanelFooterProps) {
  const { user, setUser } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const [notificationConfirmationModal, showNotificationConfirmationModal] =
    useState(false);
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: 60,
        bottom: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Taza produkt kosh">
          <Button
            onClick={() => {
              showCreateModal(true);
            }}
          >
            <AddCircleOutlineOutlinedIcon
              color="primary"
              sx={{
                fontSize: 45,
              }}
            />
          </Button>
        </Tooltip>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
        }}
      >
        <Tooltip title="Bashgalara magazindadigini duydur">
          <Button
            onClick={async () => {
              try {
                if (user == null) return;
                showNotificationConfirmationModal(true);
              } catch (e) {
                console.log(e);
                toggle(false);
                toggleMessage(
                  true,
                  "error",
                  "Bashkalara habar bermakda bir problema chykty"
                );
                setTimeout(() => {
                  toggleMessage(false);
                }, 1500);
              }
            }}
          >
            <NotificationsActiveOutlinedIcon
              color="primary"
              sx={{
                fontSize: 45,
              }}
            />
          </Button>
        </Tooltip>
      </div>
      {!user?.subscribed && (
        <div
          style={{
            position: "absolute",
            left: 0,
          }}
        >
          <Tooltip title="Magazinin soobsheniyalaryna yazyl">
            <Button
              onClick={async () => {
                try {
                  if (user?.id == null) return;
                  await registerServiceWorker(user.id);
                  setUser({ ...user, subscribed: true });
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              <AlternateEmailIcon
                color="primary"
                sx={{
                  fontSize: 45,
                }}
              />
            </Button>
          </Tooltip>
        </div>
      )}
      {notificationConfirmationModal && (
        <NotificationConfirmationModal
          showNotificationConfirmationModal={showNotificationConfirmationModal}
        />
      )}
      <Loading />
      <Message />
    </div>
  );
}
