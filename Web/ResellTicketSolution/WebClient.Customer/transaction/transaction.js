import { appConfig } from '../constant/appConfig.js';
import apiService from '../js/service/apiService.js';
import {TransactionRowComponent} from "../js/component/TransactionRowComponent.js";
import commonService from '../js/service/commonService.js';

function Transaction(){

    const id = {
        transactionList: 'transaction-list',
        btnLoadMore: 'btnLoadMore'
    }

    total: 0;

    const model = {
        page: 1,
        pageSize: 8,
        transactions: [],
        total: 0
    }
    
    
    bindEvent();
    renderTransaction();
    async function renderTransaction(){
        const params = {
            page: model.page,
            pageSize: model.pageSize
        }

        const transactions = await apiService.get(appConfig.apiUrl.transaction, params);
        const transactionListComponent = document.getElementById(id.transactionList);
        transactions.forEach((transaction, index) => {
            const transactionRow = new TransactionRowComponent(transaction, model.total + index + 1);
            model.transactions.push(transactionRow);

            transactionRow.render();
            transactionListComponent.appendChild(transactionRow.domElement);
        });
        if(transactions.length !== model.pageSize) {
            model.isLoadAll = true;
            commonService.removeAllChildren(document.getElementById(id.btnLoadMore))
        }
        model.isLoadingMore = false;
    }

    function bindEvent() {
        $(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() >= ($(document).height() - $('.footer').height())) {
                if(!model.isLoadAll && !model.isLoadingMore) {
                    model.isLoadingMore = true;
                    model.total = model.page * model.pageSize;
                    model.page += 1;
                    renderTransaction();
                } 
            }
        });  
    }
}


Transaction();