import { Plugin } from "siyuan";
import { customAddHtml } from "./modules/CustomAddHtml";
import { customEvent } from "./modules/CustomEvent";

export default class CalHeatmap extends Plugin {
    async onload() {
        customAddHtml();
        customEvent();
    }
}
