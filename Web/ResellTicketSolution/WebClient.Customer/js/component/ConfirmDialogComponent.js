import { appConfig } from '../../constant/appConfig.js';
import commonService from '../service/commonService.js';
import routeStatus from '../enum/routeStatus.js';


class ConfirmDialogComponent {

    constructor(creditCardId, headerTitle, bodyTitle, buttonName, showConfirmDialog, onBtnDeleteClicked) {
        this.headerTitle = headerTitle;
        this.bodyTitle = bodyTitle;
        this.buttonName = buttonName;
        this.creditCardId = creditCardId;

        this.event = {
            onBtnDeleteClicked,
            showConfirmDialog,
        };
        this.html = document.createElement('div');
    }

    
    

    render() {
        const headerTitle = this.headerTitle;
        const bodyTitle = this.bodyTitle;
        const buttonName = this.buttonName;
        const creditCardId = this.creditCardId;
        this.html.innerHTML = `<div class="modal fade" id="${'credit-card-' + creditCardId}" role="dialog" >
        <div class="modal-dialog" style="width: 440px">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #5cb85c;border-top-right-radius: 5px;border-top-left-radius: 5px;" >
                    <h3 class="modal-title" style="color: white;font-weight: bold">${headerTitle}</h3>
                    <button type="button" style="position: absolute;right: 10px;top: 10px;" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${bodyTitle}
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal" id="btn-delete-card" class="btn btn-success">${buttonName}</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>`;
        

        const self = this;
        //giờ ông bind event btn delete click nha
        //cau lenh nay la lay element co id = btn-delete trong this.html ak
        this.html.querySelector('#btn-delete-card').addEventListener('click', function () {
            self.event.onBtnDeleteClicked(self.creditCardId);
        });

    }

    get domElement() {
        return this.html;
    }
}

//export default CreditCardComponent

export { ConfirmDialogComponent }