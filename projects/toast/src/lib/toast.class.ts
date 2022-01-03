import { v4 as uuidV4 } from "uuid";
import { IToast } from "./models/toast.interface";
import { ToastTypes } from "./models/toast.types";

export class Toast implements IToast {
    id!: string;
    title!: string;
    type!: ToastTypes;
    description?: string;
    sticky?: boolean;
    retry?: () => any;

    constructor(item: IToast) {
        this.id = uuidV4();
        this.title = item.title as string;
        this.description = item.description as string;
        this.type = item.type as ToastTypes;
        this.sticky = ToastTypes.ACTION == this.type ? true : !!item.sticky;
        this.retry = item.retry;
    }
}
