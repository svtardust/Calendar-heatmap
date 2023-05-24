import { Plugin } from "siyuan";
import { addElement, removeElement } from './modules/CustomElement';
import { addEvent, removeEvent } from "./modules/CustomEvent";
import { removeLocalData } from './modules/Heatmap'

export default class CalHeatmap extends Plugin {

    onload() {
        addElement();
        addEvent();
    }

    onunload() {
        removeEvent();
        removeElement();
        removeLocalData();
    }
}
