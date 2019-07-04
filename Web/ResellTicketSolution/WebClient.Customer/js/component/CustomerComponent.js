import commonService from '../service/commonService.js';

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
                        
                            <div class="row">
                                <div class="form-group">
									<label class="control-label col-sm-3">Passenger Name:</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" placeholder="Passenger Name" id="passengerName"/>
									</div>	
								</div>
                            </div>
                            <div class="row">
                                <div class="form-group">
									<label class="control-label col-sm-3">Email Booking:</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" placeholder="Email Booking" id="emailBooking"/>
									</div>	
								</div>
                            </div>
                    </div>
                </div>
            </div>`;

        return this.html;
    }
    get passengerDetail() {
        this.html.params = {
            passengerName: document.getElementById('passengerName').value,
            emailBooking: document.getElementById('emailBooking').value
        }
        return this.html.params;
    }
    get domElement() {
        return this.html;
    }
}

export default CustomerComponent