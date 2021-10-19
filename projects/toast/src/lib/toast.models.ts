import { v4 as uuidV4 } from "uuid";

export enum ToastTypes {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info",
    ACTION = "action"
}

export class Toast {
    id!: string;
    title!: string;
    description!: string;
    type!: ToastTypes;
    sticky?: boolean;
    retry?: () => any;

    constructor(item: Partial<Toast>) {
        this.id = uuidV4();
        this.title = item.title as string;
        this.description = item.description as string;
        this.type = item.type as ToastTypes;
        this.sticky = ToastTypes.ACTION == this.type ? true : !!item.sticky;
        this.retry = item.retry;
    }
}
