import { createContext } from "react";

export type CommentProps = { name: string; date: string; comment: string }[];

export type CommentContextProps = {
  comments: CommentProps;
  openCommentDialog: boolean;
  setOpenCommentDialog: (open: boolean) => void;
  setComments: (comments: CommentProps) => void;
};

export default createContext<CommentContextProps>({
  comments: [],
  openCommentDialog: false,
  setOpenCommentDialog: () => undefined,
  setComments: () => undefined,
});
