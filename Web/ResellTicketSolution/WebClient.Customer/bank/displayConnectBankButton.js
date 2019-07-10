
import { appConfig } from "./../constant/appConfig.js";
import commonService from "./../js/service/commonService.js";
import toastService from './../js/service/toastService.js';
import apiService from "../js/service/apiService.js";

function DisplayController() {

    const id = {
        linkConnect: 'link-connect',
        valueLink: 'value-link',
        btnReload: 'btn-reload'
    }

    const variable = {
        isConnect: false
    }

    const elements = {
        linkConnect: document.getElementById(id.linkConnect),
        valueLink: document.getElementById(id.valueLink),
        btnReload: document.getElementById(id.btnReload)
    }

    init();

    async function init() {

        //elements.btnReload.addEventListener('click', onClickToView);
        try {
            var checkIsConnectResponse = await apiService.get(appConfig.apiUrl.checkIsConnectedBank);
            variable.isConnect = true;
        } catch (error) {
            variable.isConnect = false;
        }
        
        if (variable.isConnect) {
            elements.linkConnect.href = appConfig.bankConnect.linkCreate;
            elements.valueLink.textContent = "Connect with Stripes";
        } else {
            try {
                var getLinkResponse = await apiService.get(appConfig.apiUrl.getLinkConnectBank);
                elements.linkConnect.setAttribute("target", "_blank");
                elements.linkConnect.href = getLinkResponse;
                elements.valueLink.textContent = "Bank Connect";
                elements.btnReload.addEventListener('click', onClickToView);
            } catch (errorw) {
                toastService.error("Something Wrong when Loading");
            }
        }
    }

    function onClickToView() {
        window.location.reload();
    }

}

DisplayController();