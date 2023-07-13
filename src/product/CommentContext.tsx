import { createContext } from "react";

export type CommentProps = { [key: string]: string[] }[];

export type CommentContextProps = {
  comments: CommentProps;
  openCommentDialog: boolean;
  setOpenCommentDialog: (open: boolean) => void;
  setComments: (productId: number | undefined) => void;
};

export default createContext<CommentContextProps>({
  comments: [],
  openCommentDialog: false,
  setOpenCommentDialog: () => undefined,
  setComments: () => undefined,
});
