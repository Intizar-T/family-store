import { createContext } from "react";

type CommentContextProps = {
  openCommentDialog: boolean;
  setOpenCommentDialog: (open: boolean) => void;
};

export default createContext<CommentContextProps>({
  openCommentDialog: false,
  setOpenCommentDialog: () => undefined,
});
