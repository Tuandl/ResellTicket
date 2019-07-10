
import { appConfig } from "./../constant/appConfig.js";
import commonService from "./../js/service/commonService.js";
import toastService from './../js/service/toastService.js';
import apiService from "../js/service/apiService.js";

function BankControler(){

    init()

    async function init(){
        var pathName = window.location;
        console.log("path:", pathName.href);
        console.log("link:", appConfig.bankConnect.prexitResponse);
        console.log("isSS", pathName.href.includes(appConfig.bankConnect.prexitResponse));
        if(pathName.href.includes(appConfig.bankConnect.prexitResponse)){
            var codeId = commonService.getQueryParam('code');
            const param = {
                code: codeId
            }
            try {
                var response = await apiService.putParams(appConfig.apiUrl.addBankConnectAccount, param);
                if(response.status === 200) {
                    window.location.href = appConfig.url.bank.success;
                } else {
                    toastService.error("Connect Bank with Stripe Failed");    
                }
            } catch (error) {
                toastService.error("Error on Connecting Bank with Stripe Failed");
            }
        }
    }


}

BankControler();