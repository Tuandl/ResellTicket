import { appConfig } from '../../constant/appConfig.js';
import commonService from '../service/commonService.js';
import routeStatus from '../enum/routeStatus.js';
import { ConfirmDialogComponent } from "./../../js/component/ConfirmDialogComponent.js";


class CreditCardComponent {

    constructor(creditCard, customerId, onBtnDeleteClicked, onBtnSetDefault, showConfirmDialog) {
        this.creditCard = creditCard;
        this.customerId = customerId;
        this.html = document.createElement('tr');
        //ong luu lai o day ne
        //ong luu lai event trong property của class này á
        this.event = {
            onBtnDeleteClicked,
            onBtnSetDefault,
            showConfirmDialog
        };
    }

    renderBrand(brand) {
        switch (brand) {
            case "jcb":
                return "http://www.jcbeurope.eu/about/emblem_slogan/images/index/logo_img01.jpg";
            case "master-card":
                return "https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Fsteveolenski%2Ffiles%2F2016%2F07%2FMastercard_new_logo-1200x865.jpg";
            case "discover":
                return "https://seeklogo.com/images/D/Discover_Card-logo-4BC5D7C02C-seeklogo.com.png";
            case "diners-club":
                return "https://www.cbanque.com/i/media/02i/002338iac5.jpg";
            case "american-express":
                return "http://www.scalsys.com/png/american-express-logo-png/american-express-logo-png_147383.png";
            case "visa":
                return "https://seeklogo.com/images/V/VISA-logo-F3440F512B-seeklogo.com.png";
            default:
                return "https://cdn2.iconfinder.com/data/icons/summer-glyph-3/128/135-512.png";
        }
    }

    renderCheck(isdefault) {
        if (isdefault) {
            return `<span style="color: green" class="glyphicon glyphicon-ok" aria-hidden="true"></span>`;
        } else {
            return ``;
        }
    }

    // renderButton(isdefault) {
    //     if (!isdefault) {
    //         return `<td class="col-sm-1"><button type="button" id="btn-delete"  class="btn btn-danger btn-sm">Delete</button></td>
    //         <td class="col-sm-1"><button type="button" id="btn-set-default" class="btn btn-info btn-sm">Set Default</button></td>`;
    //     } else {
    //         return `<td class="col-sm-1"><button type="button" id="btn-delete" style="visibility: hidden" class="btn btn-danger btn-sm"></button></td>
    //         <td class="col-sm-1"><button type="button" id="btn-set-default" style="visibility: hidden" class="btn btn-info btn-sm"></button></td>`;
    //     }
    // }

    renderButton(isdefault) {
        if (!isdefault) {
            return `<td><button type="button" id="btn-delete"  class="btn btn-danger btn-sm">Delete</button></td>
            <td class="col-sm-1"><button type="button" id="btn-set-default" class="btn btn-info btn-sm">Set Default</button></td>`;
        } else {
            return `<td><button type="button" id="btn-delete" style="visibility: hidden" class="btn btn-danger btn-sm"></button></td>
            <td class="col-sm-1"><button type="button" id="btn-set-default" style="visibility: hidden" class="btn btn-info btn-sm"></button></td>`;
        }
    }

    render() {
        const creditCard = this.creditCard;

        this.html.innerHTML = `<td style="font-size: 12pt" class="">${creditCard.last4DigitsHash} &nbsp;&nbsp;&nbsp;
            ${this.renderCheck(creditCard.isdefault)}
        </td>
        <td><img alt="Credit Card Logos" title="Credit Card Logos"
                src=${this.renderBrand(creditCard.brand)}
                width="60" height="40" /></td>
        ${this.renderButton(creditCard.isdefault)}`;
        const self = this;
        //giờ ông bind event btn delete click nha
        //cau lenh nay la lay element co id = btn-delete trong this.html ak
        this.html.querySelector('#btn-delete').addEventListener('click', function() {
            //khi btn duocj click thi ong trigger event o controller
            //trigger event o controller thi ong truyen them creditCardId 
            //Tuc la trong function event nay thì biến this nó không còn là CreditCardComponent nữa, maf laf 
            //mà biến thís trong này là button delete á
            //nên ông muốn gọi thí.event.onBtnDeleteClicked thì ông phải làm vậy nè

            self.event.showConfirmDialog(self.creditCard.id);
        });

        this.html.querySelector('#btn-set-default').addEventListener('click', function() {
            self.event.onBtnSetDefault(self.creditCard.id, self.customerId);
        });
    }

    get domElement() {
        return this.html;
    }
}

//export default CreditCardComponent

export { CreditCardComponent }