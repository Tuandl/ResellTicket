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
    LOAD_MORE_THREADHOLD = 100;
    DROPDOWN_WRAPPER_ID = 'notification-dropdown-wrapper';
    EMPTY_BACKGROUND_CLASS = 'notification-empty-wrapper';

    constructor(containerElement) {
        this.containerElement = containerElement;

        this.getNotificationDataTable = this.getNotificationDataTable.bind(this);
        this.render = this.render.bind(this);
        this.generateDropDownButtonElement = this.generateDropDownButtonElement.bind(this);
        this.generateDropDownMenuElement = this.generateDropDownMenuElement.bind(this);
        this.onScrollNotification = this.onScrollNotification.bind(this);
        this.loadMoreNotification = this.loadMoreNotification.bind(this);
        this.onOpenNotificationDropDown = this.onOpenNotificationDropDown.bind(this);

        this.init();
    }

    async init() {
        // await this.getNotificationDataTable(this.page, this.pageSize);
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
        } catch (ex) {
            toastService.error('An error occured when getting notification data.');
            console.error('Get Notification Data', ex);
        }
    }

    render() {
        const headerWrapper = commonService.htmlToElement(`<h4></h4>`);
        const divWrapper = commonService.htmlToElement(`<div class="btn-group top-head-dropdown" id="${this.DROPDOWN_WRAPPER_ID}"></div>`);

        divWrapper.appendChild(this.generateDropDownButtonElement());
        this.wrapperDropDownMenu = this.generateDropDownMenuElement();
        divWrapper.appendChild(this.wrapperDropDownMenu);

        headerWrapper.appendChild(divWrapper);

        commonService.removeAllChildren(this.containerElement);
        this.containerElement.appendChild(headerWrapper);

        $(document).ready((function() {
            $('#notification-dropdown-container').scroll(this.onScrollNotification);

            $(`#${this.DROPDOWN_WRAPPER_ID}`).on("show.bs.dropdown", this.onOpenNotificationDropDown);
        }).bind(this));
        
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
        const wrapper = commonService.htmlToElement(`<ul class="dropdown-menu text-left" id="notification-dropdown-container"></ul>`);
        const empElm = commonService.htmlToElement(`<li></li>`);
        wrapper.appendChild(empElm);
        return wrapper;
        // if (this.data.length === 0) {
        //     const wrapperEmpty = commonService.htmlToElement(`<ul class="dropdown-menu text-left" id="notification-dropdown-container" style="text-align:center;background-image: url(/images/empty_list_noti.png);background-size: 100% 100%;"></ul>`);
        //     const row = new NotificationRowComponent("");
        //     wrapperEmpty.appendChild(row.generateNotificationRowElementEmpty());
        //     return wrapperEmpty;
        // } else {
        //     const wrapper = commonService.htmlToElement(`<ul class="dropdown-menu text-left" id="notification-dropdown-container"></ul>`);
        //     this.data.forEach(notification => {
        //         const row = new NotificationRowComponent(notification);
        //         wrapper.appendChild(row.generateNotificationRowElement());
        //     });
        //     return wrapper;
        // }
    }

    async loadMoreNotification() {
        this.page++;
        await this.getNotificationDataTable(this.page, this.pageSize);

        if(this.total > 0) {
            this.wrapperDropDownMenu.classList.remove(this.EMPTY_BACKGROUND_CLASS);
        } else {
            this.wrapperDropDownMenu.classList.add(this.EMPTY_BACKGROUND_CLASS);
        }

        this.data.forEach(notification => {
            const row = new NotificationRowComponent(notification);
            this.wrapperDropDownMenu.appendChild(row.generateNotificationRowElement());
        });

        this.isLoadingMore = false;
    }

    onScrollNotification() {
        if ($('#notification-dropdown-container').innerHeight() + $('#notification-dropdown-container').scrollTop() >= $('#notification-dropdown-container')[0].scrollHeight) {
            if (this.page * this.pageSize < this.total && !this.isLoadingMore) {
                this.isLoadingMore = true;
                this.loadMoreNotification();
            }
        }
    }

    async onOpenNotificationDropDown() {
        this.page = 0;
        this.data = [];
        this.total = 0;
        commonService.removeAllChildren(this.wrapperDropDownMenu);
        this.wrapperDropDownMenu.classList.add('loader');
        await this.loadMoreNotification();
        this.wrapperDropDownMenu.classList.remove('loader');
    }
}