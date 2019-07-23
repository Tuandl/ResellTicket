import toastService from "../service/toastService.js";
import { authenticationService } from '../service/authenticationService.js';
import commonService from "../service/commonService.js";
import NotificationDropDownComponent from "./notificationComponents/NotificationDropDownComponent.js";
import apiService from '../service/apiService.js';
import { appConfig } from '../../constant/appConfig.js';

export default class TopBarComponent {

    containerId = 'top-bar-container';

    constructor(containerId) {
        if (containerId) {
            this.containerId = containerId;
        }

        this.container = document.getElementById(this.containerId);
    }

    render() {
        if (!this.container) {
            toastService.error('Not found container for Top bar');
        }

        if (authenticationService.isLogedin()) {
            this.renderLogedinTopbar();
        } else {
            this.renderAnnonymousTopbar();
        }
    }

    renderLogedinTopbar() {
        const currentUser = authenticationService.getUserInformation();

        const wrapper = commonService.htmlToElement(`<ul class="card"></ul>`);
        const welcomeItem = commonService.htmlToElement(`
            <li>
                <h4>Welcome <span class="text-capitalize">${currentUser.fullName}</span>!!!</h4>
            </li>`
        );

        const profileItem = commonService.htmlToElement(`
            <li>
                <h4><a href="/updateProfile.html"><i class="fa fa-user" aria-hidden="true"></i>Me</a>
                </h4>
            </li>
        `);

        const notificationWrapper = commonService.htmlToElement(`<li></li>`);
        new NotificationDropDownComponent(notificationWrapper);

        const logoutItem = commonService.htmlToElement(`
            <li>
                <h4>
                    <a style="cursor: pointer">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>Logout
                    </a>
                </h4>
            </li>
        `);
        logoutItem.querySelector('a').addEventListener('click', this.onLogoutClicked);

        wrapper.appendChild(welcomeItem);
        wrapper.appendChild(profileItem);
        wrapper.appendChild(notificationWrapper);
        wrapper.appendChild(logoutItem);

        commonService.removeAllChildren(this.container);
        this.container.appendChild(wrapper);
    }

    renderAnnonymousTopbar() {
        const element = commonService.htmlToElement(`
            <ul class="card">
                <li>
                    <h4><a href="/login.html"><i class="fa fa-sign-in" aria-hidden="true"></i>Login</a></h4>
                </li>
                <li>
                    <h4><a href="/checkPhoneNo.html"><i class="fa fa-key" aria-hidden="true"></i>Register</a></h4>
                </li>
            </ul>
        `);

        commonService.removeAllChildren(this.container);
        this.container.appendChild(element);
    }

    async onLogoutClicked() {
        var deviceId = ''
        await OneSignal.getUserId(function (userId) {
            deviceId = userId;
        });
        var params = {
            deviceId : deviceId
        }
        var res = await apiService.putParams(appConfig.apiUrl.logout, params)
        if (res.status === 200) {
            authenticationService.logout();
            window.location.replace('/index.html');
        }
    }
}