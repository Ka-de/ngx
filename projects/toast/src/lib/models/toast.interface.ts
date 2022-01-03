import { ToastTypes } from "./toast.types";

export interface IToast{
    title: string;
    type: ToastTypes;
    description?: string;
    sticky?: boolean;
    retry?: () => any;
}