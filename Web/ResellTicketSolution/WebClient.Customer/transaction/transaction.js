import { appConfig } from '../constant/appConfig.js';
import apiService from '../js/service/apiService.js';
import {TransactionRowComponent} from "../js/component/TransactionRowComponent.js";
import commonService from '../js/service/commonService.js';

function Transaction(){

    const id = {
        transactionList: 'transaction-list',
        btnLoadMore: 'btnLoadMore',
        tableTransasctionList: 'table-transasction-list',
        showEmptyList: 'show-empty-list'
    }

    

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
        transactions.forEach(transaction => {
            model.total += 1;
            const transactionRow = new TransactionRowComponent(transaction, model.total);
            model.transactions.push(transactionRow);

            transactionRow.render();
            transactionListComponent.appendChild(transactionRow.domElement);
        });
        if(model.total === 0){
            document.getElementById(id.tableTransasctionList).style.display = 'none';
            document.getElementById(id.showEmptyList).style.display = 'block';
        } else {
            document.getElementById(id.tableTransasctionList).style.display = 'inline-table';
            document.getElementById(id.showEmptyList).style.display = 'none';
        }
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
                    //model.total = model.page * model.pageSize;
                    model.page += 1;
                    renderTransaction();
                } 
            }
        });  
    }
}


Transaction();