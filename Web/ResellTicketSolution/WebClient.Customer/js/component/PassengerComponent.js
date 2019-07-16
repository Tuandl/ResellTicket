import commonService from '../service/commonService.js';
import apiService from '../service/apiService.js';
import { appConfig } from '../../constant/appConfig.js';

class PassengerComponent {


    constructor(ticketId) {
        this.html = document.createElement('div');
        this.html.id = ticketId;

        this.html.info = {};
    }

    render() {

        this.html.innerHTML =
            `<div class="margin-bottom-20">
                <div class="">
                    <h3 style="color: '#fab005'">
                        <div class="row margin-top-20 margin-bottom-20">
                            <div class="col-sm-12 text-center">
                                <div>Customer Information</div>
                            </div>
                        </div>
                    </h3>

                    <div class="customer-form">
                        <input type="hidden" value=${this.html.id} />
                        <form class="form-horizontal">
                            <div class="row">
                                <div class="form-group">
									<label class="control-label col-sm-3">New Passenger Name:</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" value="${this.html.info.buyerPassengerName}" id="buyerPassengerName"/>
									</div>	
								</div>
                            </div>
                            <div class="row">
                                <div class="form-group">
									<label class="control-label col-sm-3">New Passenger Email:</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" value="${this.html.info.buyerPassengerEmail}" id="buyerPassengerEmail"/>
									</div>	
								</div>
                            </div>
                            <div class="row">
                                <div class="form-group">
									<label class="control-label col-sm-3">New Passenger Phone:</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" value="${this.html.info.buyerPassengerPhone}" id="buyerPassengerPhone"/>
									</div>	
								</div>
                            </div>
                            <div class="row">
                                <div class="form-group">
									<label class="control-label col-sm-3">New Passenger Identify:</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" value="${this.html.info.buyerPassengerIdentify}" id="buyerPassengerIdentify"/>
									</div>	
								</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;

        return this.html;
    }
    async passengerDetail() {
        var params = {
            ticketId: this.html.id
        }
        var data = await apiService.get(appConfig.apiUrl.ticketViewPassengerInfo, params);
        this.html.info = {
            buyerPassengerName: data.buyerPassengerName,
            buyerPassengerEmail: data.buyerPassengerEmail,
            buyerPassengerPhone: data.buyerPassengerPhone,
            buyerPassengerIdentify: data.buyerPassengerIdentify
        }
        return this.html.info;
    }
    get domElement() {
        return this.html;
    }

    disabledField() {
        document.getElementById('buyerPassengerName').disabled = true;
        document.getElementById('buyerPassengerEmail').disabled = true;
        document.getElementById('buyerPassengerPhone').disabled = true;
        document.getElementById('buyerPassengerIdentify').disabled = true;
    }
}

export default PassengerComponent