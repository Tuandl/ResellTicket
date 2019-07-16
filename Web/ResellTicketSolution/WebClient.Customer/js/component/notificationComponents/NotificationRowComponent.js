import commonService from "../../service/commonService.js";
import { appConfig } from "../../../constant/appConfig.js";
import apiService from "../../service/apiService.js";
import toastService from "../../service/toastService.js";

export default class NotificationRowComponent {

    /**
     * constructor
     * @param {object} notification 
     */
    constructor(notification) {
        this.data = notification;
        this.elementId = commonService.generateRandomId();

        this.onNotificationClicked = this.onNotificationClicked.bind(this);
    }

    generateNotificationRowElement() {
        let elementStr = ``;
        elementStr += `<li>`;
        elementStr +=   `<a class="top-text-block">`;
        if(this.data.read) {
            elementStr +=   `<div class="top-text-heading">${this.data.message}</div>`;
        } else {
            elementStr +=   `<div class="top-text-heading"><b>${this.data.message}</b></div>`;
        }
        elementStr +=       `<div class="top-text-light">${moment.utc(this.data.createdAtUTC).local().format(appConfig.format.datetimeNotification)}</div>`;
        elementStr +=   `</a>`;
        elementStr += `<li>`;

        const element = commonService.htmlToElement(elementStr);
        element.addEventListener('click', this.onNotificationClicked);
        element.id = this.elementId;
        return element;
    }

    rerender() {
        const oldElement = document.getElementById(this.elementId);
        if(oldElement) {
            const newElement = this.generateNotificationRowElement();
            commonService.replaceElementItself(oldElement, newElement);
        }
    }

    async onNotificationClicked() {
        try {
            await apiService.post(`${appConfig.apiUrl.notification}/${this.data.id}/read`);
            this.data.read = true;
            this.rerender();
        } catch(ex) {
            toastService.error('An error occured when read notification.');
            console.warn('Error reading notificaiton', ex);
        }
    }
}