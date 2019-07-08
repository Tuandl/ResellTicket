import cardParserService from './../js/service/cardParserService.js';
import { appConfig } from "./../constant/appConfig.js";
import apiService from './../js/service/apiService.js';
import toastService from './../js/service/toastService.js';

function createCreditCardController() {

    const id = {
        txtNumber: 'txt-number',
        txtName: 'txt-name',
        txtExpiry: 'txt-expiry',
        txtCVC: 'txt-cvc',
        btnCreateCreditCard: 'btnCreateCreditCard',
        numberAlert: 'number-alert',
        nameAlert: 'name-alert',
        expiryAlert: 'expiry-alert',
        cvcAlert: 'cvc-alert',
    }

    const validate = {
        number_valid: false,
        name_valid: false,
        expiry_valid: false,
        cvc_valid: false,
        isCreated: false
    }
    const variable = {
        stripeId: ''
    }

    const data = {
        brand: '',
        nameOnCard: '',
        cvc: '',
        postalCode: '',
        last4DigitsHash: '',
        expiredYearHash: '',
        expiredMonthHash: '',
        customerId: localStorage.getItem('ID')
    }

    const elements = {
        txtNumber: document.getElementById(id.txtNumber),
        txtName: document.getElementById(id.txtName),
        txtExpiry: document.getElementById(id.txtExpiry),
        txtCVC: document.getElementById(id.txtCVC),
        btnCreateCreditCard: document.getElementById(id.btnCreateCreditCard),
        numberAlert: document.getElementById(id.numberAlert),
        nameAlert: document.getElementById(id.nameAlert),
        expiryAlert: document.getElementById(id.expiryAlert),
        cvcAlert: document.getElementById(id.cvcAlert),
    }

    init()

    async function init() {
        elements.btnCreateCreditCard.addEventListener('click', onBtnCreateCreditCard);
    }

    async function onValidateCreditCard() {
        console.log("txtNumber:", elements.txtNumber.value);
        console.log("txtNumber:", cardParserService.GetBrandBank(elements.txtNumber.value));
        var pattNumber = /^[0-9 ]{19}$/;
        if (cardParserService.GetBrandBank(elements.txtNumber.value) !== "placeholder"
            && pattNumber.test(elements.txtNumber.value)) {
            validate.number_valid = true;
            data.last4DigitsHash = elements.txtNumber.value;//.replace(/^.{14}/g, '**** **** ****');
        } else {
            validate.number_valid = false;
        }
        var pattName = /^[a-zA-Z ]{6,100}$/;
        if (elements.txtName.value != null && pattName.test(elements.txtName.value)) {
            validate.name_valid = true;
            data.nameOnCard = elements.txtName.value;
        } else {
            validate.name_valid = false;
        }
        if (elements.txtExpiry.value != null) {
            console.log("txtExpiry", elements.txtExpiry.value);
            var expiry = elements.txtExpiry.value.split("/");
            var month = parseInt(expiry[0]);
            var year = parseInt(expiry[1]);
            console.log("month", month);
            console.log("year", year);
            if (expiry[0] > 0 && expiry[0] < 13 && expiry[1] > 2016 && expiry[1] < 2050) {
                validate.expiry_valid = true;
                data.expiredMonthHash = month;
                data.expiredYearHash = year;
            }
        } else {
            validate.expiry_valid = false;
        }
        var pattCVC = /^[0-9]{4}$/;
        if (elements.txtCVC.value != null && pattCVC.test(elements.txtCVC.value)) {
            validate.cvc_valid = true;
            data.cvc = elements.txtCVC.value;
        } else {
            validate.cvc_valid = false;
        }
        if (validate.number_valid && validate.name_valid && validate.expiry_valid && validate.cvc_valid) {
            elements.numberAlert.style.display = 'none';
            elements.nameAlert.style.display = 'none';
            elements.expiryAlert.style.display = 'none';
            elements.cvcAlert.style.display = 'none';
            validate.isCreated = true;
        }

    }

    async function onBtnCreateCreditCard() {
        createTokenStripeCreditCard();
    }
    async function stripeResponseHandler(status, response) {
        if (response.error) {
            toastService.error("Something Wrong with Stripe.");
        } else {
            // Getting token from the response json.
            data.brand = cardParserService.GetBrandBank(data.last4DigitsHash);
            var numberBlind = data.last4DigitsHash.replace(/^.{14}/g, '**** **** ****');
            const dataCreditCard = {
                cardId: response.id,
                brand: data.brand,
                last4DigitsHash: numberBlind,
                nameOnCard: data.nameOnCard,
                customerId: data.customerId
            }


            try {
                var creditCardResponse = await apiService.post(appConfig.apiUrl.creditCard, dataCreditCard);
                if (creditCardResponse.status === 200) {
                    window.location.href = appConfig.url.creditCard.viewListCreditCard;
                    toastService.success("Create Credit Card successfully");
                } else {
                    toastService.error("Create credit card Error");
                }

            } catch (error) {
                toastService.error("Error on Creating Credit Card Data");
            }

        }
    }


    function createTokenStripeCreditCard() {
        onValidateCreditCard();
        if (validate.isCreated) {
            Stripe.setPublishableKey(appConfig.stripe.pusblishableKey);
            var strpieres = Stripe.card.createToken({
                number: data.last4DigitsHash,
                cvc: data.cvc,
                exp_month: data.expiredMonthHash,
                exp_year: data.expiredYearHash
            }, stripeResponseHandler);

        } else {
            if (!validate.number_valid) {
                elements.numberAlert.style.display = 'block';
            } else {
                elements.numberAlert.style.display = 'none';
            }
            if (!validate.name_valid) {
                elements.nameAlert.style.display = 'block';
            } else {
                elements.nameAlert.style.display = 'none';
            }
            if (!validate.expiry_valid) {
                elements.expiryAlert.style.display = 'block';
            } else {
                elements.expiryAlert.style.display = 'none';
            }
            if (!validate.cvc_valid) {
                elements.cvcAlert.style.display = 'block';
            } else {
                elements.cvcAlert.style.display = 'none';
            }
        }
    }

}

createCreditCardController();
