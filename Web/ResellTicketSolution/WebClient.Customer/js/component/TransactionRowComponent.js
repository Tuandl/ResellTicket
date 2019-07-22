import { appConfig } from '../../constant/appConfig.js';
import commonService from '../service/commonService.js';
import routeStatus from '../enum/routeStatus.js';
import { ConfirmDialogComponent } from "./../../js/component/ConfirmDialogComponent.js";


class TransactionRowComponent {

    constructor(transaction, index) {
        this.transaction = transaction;
        this.index = index;
        this.html = document.createElement('tr');
    }

    renderType(type) {
        switch (type) {
            case "Payment":
                return `<span class="label label-danger" style="font-size: 17px;" >${type}</span>`;
            case "Payout":
                return `<span class="label label-success" style="font-size: 17px;" >${type}</span>`;
            case "Refund":
                return `<span class="label label-success" style="font-size: 17px;" >${type}</span>`;
        }
    }

    render() {
        const transaction = this.transaction;
        const index = this.index;
        this.html.innerHTML = `<td>${index}</td>
        <td>${this.renderType(transaction.type)}</td>
        <td>${transaction.description}</td>
        <td>${moment(transaction.createdAtUTC).format(appConfig.format.datetimeNotification)}</td>
        <td>${numeral(transaction.amount).format('$0,0.00')}</td>`;
    }

    get domElement() {
        return this.html;
    }
}

//export default CreditCardComponent

export { TransactionRowComponent }