import { createContext } from "react";

export type CommentProps = { name: string; date: string; comment: string }[];

export type CommentContextProps = {
  comments: CommentProps;
  openCommentDialog: boolean;
  productId: number | undefined;
  productName: string | undefined;
  setProductName: (productName: string | undefined) => void;
  setProductId: (productId: number | undefined) => void;
  setOpenCommentDialog: (open: boolean) => void;
  setComments: (comments: CommentProps) => void;
};

export default createContext<CommentContextProps>({
  comments: [],
  openCommentDialog: false,
  productId: undefined,
  productName: undefined,
  setProductName: () => undefined,
  setProductId: () => undefined,
  setOpenCommentDialog: () => undefined,
  setComments: () => undefined,
});
