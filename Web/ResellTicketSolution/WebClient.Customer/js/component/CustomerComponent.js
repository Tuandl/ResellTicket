import commonService from '../service/commonService.js';
import toastService from "../service/toastService.js";
import apiService from '../service/apiService.js';
import { appConfig } from "../../constant/appConfig.js";

class CustomerComponent {

    constructor(routeId) {
        this.html = document.createElement('div');
        this.html.id = routeId || commonService.generateRandomId();
        this.html.params = {};
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
                                        <label class="control-label col-sm-4">New Passenger Name:</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" placeholder="Passenger Name" id="passengerName"/>
                                        </div>	
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <label class="control-label col-sm-4">New Passenger Email:</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" placeholder="Passenger Email" id="passengerEmail"/>
                                        </div>	
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <label class="control-label col-sm-4">New Passenger Phone:</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" placeholder="Passenger Phone" id="passengerPhone"/>
                                        </div>	
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <label class="control-label col-sm-4">New Passenger Identification:</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" placeholder="Passenger Identification" id="passengerIdentify"/>
                                        </div>	
                                    </div>
                                </div>
                            </form>
                    </div>
                </div>
            </div>`;

        return this.html;
    }
    get passengerDetail() {
        this.html.params = {
            buyerPassengerName: document.getElementById('passengerName').value,
            buyerPassengerEmail: document.getElementById('passengerEmail').value,
            buyerPassengerPhone: document.getElementById('passengerPhone').value,
            buyerPassengerIdentify: document.getElementById('passengerIdentify').value            
        }
        return this.html.params;
    }

    async AutoFillCustomerDetail() {
        try {
            var customerResponse = await apiService.get(appConfig.apiUrl.customerDetail, '');
                document.getElementById('passengerName').value = customerResponse.fullName;
                var x = document.getElementById('passengerName').value;
                document.getElementById('passengerEmail').value = customerResponse.email;
                document.getElementById('passengerPhone').value = customerResponse.phoneNumber; 
        } catch (ex) {
            toastService.error('error');
        }
    }
    get domElement() {
        return this.html;
    }
}

export default CustomerComponent