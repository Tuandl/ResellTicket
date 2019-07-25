import { appConfig } from "./../constant/appConfig.js";
import apiService from './../js/service/apiService.js';
import commonService from "./../js/service/commonService.js";
import { CreditCardComponent } from "./../js/component/CreditCardComponent.js";
import { ConfirmDialogComponent } from "./../js/component/ConfirmDialogComponent.js";
import toastService from './../js/service/toastService.js';



function ListCreditCardViewController() {

    const id = {
        creditCardList: 'credit-card-list',
        dialogConfirmCreditCard: 'dialog-confirm-credit-card',
        showEmptyList: 'show-empty-list'
    }

    const elements = {
        creditCardList: document.getElementById(id.creditCardList),
        dialogConfirmCreditCard: document.getElementById(id.dialogConfirmCreditCard),
        showEmptyList: document.getElementById(id.showEmptyList)
    }



    const model = {
        creditCard: [],
        dialogCreditCard:[]
    }

    init();

    function init() {


        renderCreditCard();
    }

    async function renderCreditCard() {
        const param = {
            id: localStorage.getItem('ID')
        }
        var creditCards = await apiService.get(appConfig.apiUrl.creditCard, param);
        commonService.removeAllChildren(elements.creditCardList);
        commonService.removeAllChildren(elements.dialogConfirmCreditCard);
        const customerId = param.id;
        if(creditCards.length === 0){
            elements.showEmptyList.style.display = 'block';
        } else {
            elements.showEmptyList.style.display = 'none';
        }
        creditCards.forEach(creditCard => {
            const creditCardElement = new CreditCardComponent(creditCard, customerId, onBtnDeleteClicked, onBtnSetDefault, showConfirmDialog);

            const confirmDialogElement = new ConfirmDialogComponent(creditCard.id, "Delete Credit Card",
                "Do you want to Delete this Credit Card ?", "Delete", showConfirmDialog, onBtnDeleteClicked);
                
            model.dialogCreditCard.push(confirmDialogElement);
            confirmDialogElement.render();
            elements.dialogConfirmCreditCard.appendChild(confirmDialogElement.domElement);

            model.creditCard.push(creditCardElement);
            creditCardElement.render();
            elements.creditCardList.appendChild(creditCardElement.domElement);
        });
    }

    async function onBtnDeleteClicked(cardId) {
        const param = {
            Id: cardId
        }
        //1
        try {
            var reponse = await apiService.putParams(appConfig.apiUrl.creditCard, param);
            if (reponse.status === 200) {
                toastService.success("Delete Credit Card Successfully.");
            } else {
                toastService.error("Delete Credit Card Failed.");
            }
        } catch (error) {
            toastService.error("Error on Deleting Credit Card");
        }

        renderCreditCard();
    }

    function showConfirmDialog(creditCardId) {
        $('#credit-card-' + creditCardId).modal();
    }

    async function onBtnSetDefault(cardId, cusId) {
        const param = {
            CustomerId: parseInt(cusId),
            Id: cardId,

        }
        try {
            var reponse = await apiService.putParams(appConfig.apiUrl.setDefaultCard, param);
            if (reponse.status === 200) {
                toastService.success("Credit Card has been set default successfully.");
            } else {
                toastService.error("Credit Card has been set default failed.");
            }
        } catch (error) {
            toastService.error("Error on Setting Credit Card default.");
        }

        renderCreditCard();
    }

}

ListCreditCardViewController();