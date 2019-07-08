import { appConfig } from "./../constant/appConfig.js";
import apiService from './../js/service/apiService.js';
import commonService from "./../js/service/commonService.js";
import { CreditCardComponent } from "./../js/component/CreditCardComponent.js";



function ListCreditCardViewController() {

    const id = {
        creditCardList: 'credit-card-list',
        btnDelete: 'btn-delete',
        btnSetDefault: 'btn-set-default'
    }

    const elements = {
        creditCardList: document.getElementById(id.creditCardList),
        btnDelete: document.getElementById(id.btnDelete),
        btnSetDefault: document.getElementById(id.btnSetDefault),
    }

    

    const model = {
        creditCard: [],
    }

    init();

    function init() {
        
        
        renderCreditCard();
        elements.btnDelete.addEventListener('click', onBtnDeleteClicked);
        elements.btnSetDefault.addEventListener('click', onBtnSetDefault);
        
    }

    async function renderCreditCard(){
        const param = {
            id: localStorage.getItem('ID')
        }
        var creditCards = await apiService.get(appConfig.apiUrl.creditCard, param);
        commonService.removeAllChildren(elements.creditCardList);
        const customerId = param.id;
        creditCards.forEach(creditCard => {
            const creditCardElement = new CreditCardComponent(creditCard, customerId, onBtnDeleteClicked, onBtnSetDefault);

            model.creditCard.push(creditCardElement);
            creditCardElement.render();
            elements.creditCardList.appendChild(creditCardElement.domElement);
        });
    }

    async function onBtnDeleteClicked(cardId){
        const param = {
            id: cardId
        }
        var reponse = await apiService.put(appConfig.apiUrl.creditCard, param);
        renderCreditCard(); 
    }

    async function onBtnSetDefault(cardId, cusId) {
        const param = {
            CustomerId: parseInt(cusId),
            Id: cardId,
            
        }
        var reponse = await apiService.put(appConfig.apiUrl.setDefaultCard, param);
        renderCreditCard();
    }

}

ListCreditCardViewController();