import apiService from "../../service/apiService.js";
import { appConfig } from "../../../constant/appConfig.js";
import toastService from "../../service/toastService.js";
import commonService from "../../service/commonService.js";
import NotificationRowComponent from "./NotificationRowComponent.js";

export default class NotificationDropDownComponent {

    page = 1;
    pageSize = 10;
    data = [];
    total = 0;

    constructor(containerId) {
        this.containerId = containerId;
        this.containerElement = document.getElementById(containerId);

        this.getNotificationDataTable = this.getNotificationDataTable.bind(this);
        this.render = this.render.bind(this);
        this.generateDropDownButtonElement = this.generateDropDownButtonElement.bind(this);
        this.generateDropDownMenuElement = this.generateDropDownMenuElement.bind(this);

        this.init();
    }

    async init() {
        await this.getNotificationDataTable(this.page, this.pageSize);
        this.render();
    }

    async getNotificationDataTable(page, pageSize) {
        const params = {
            page: page,
            pageSize: pageSize,
        };
        try {
            const resposneObj = await apiService.get(appConfig.apiUrl.notificationDataTable, params);
            this.data = resposneObj.data;
            this.total = resposneObj.total;
        } catch(ex) {
            toastService.error('An error occured when getting notification data.');
            console.error('Get Notification Data', ex);
        }
    }

    render() {
        const wrapper = commonService.htmlToElement(`<div class="btn-group top-head-dropdown"></div>`);

        wrapper.appendChild(this.generateDropDownButtonElement());
        wrapper.appendChild(this.generateDropDownMenuElement());
        
        commonService.removeAllChildren(this.containerElement);
        this.containerElement.appendChild(wrapper);
    }

    generateDropDownButtonElement() {
        const element = commonService.htmlToElement(
            `<a style="cursor: pointer;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-bell" aria-hidden="true"></i>Notification<b class="caret"></b>
            </a>`
        );
        return element;
    }

    generateDropDownMenuElement() {
        const wrapper = commonService.htmlToElement(`<ul class="dropdown-menu text-left"></ul>`);

        this.data.forEach(notification => {
            const row = new NotificationRowComponent(notification);
            wrapper.appendChild(row.generateNotificationRowElement());
        });

        return wrapper;
    }
}