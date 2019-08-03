import commonService from './service/commonService.js';
import toastService from './service/toastService.js';
import toastEnum from './enum/toastEnum.js';

function receiveToastMessageHandler() {
    var message = commonService.getQueryParam(toastEnum.queryParamKey.message);
    var messageType = commonService.getQueryParam(toastEnum.queryParamKey.type);
    
    if(message) {
        switch(messageType) {
            case toastEnum.type.success: 
                toastService.success(message);
                break;
            case toastEnum.type.error:
                toastService.error(message);
                break;
        }
        //remove query params to prevent retoast
        window.history.replaceState(null, null, window.location.pathname);
    }
}

receiveToastMessageHandler();