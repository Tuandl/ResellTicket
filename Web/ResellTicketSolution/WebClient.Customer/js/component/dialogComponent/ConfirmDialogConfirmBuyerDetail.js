class ConfirmDialogConfirmBuyerDetail {

    constructor(headerTitle, bodyTitle, buttonName, onBtnConfirmClickedCallApi) {
        this.headerTitle = headerTitle;
        this.bodyTitle = bodyTitle;
        this.buttonName = buttonName;

        this.event = {
            onBtnConfirmClickedCallApi,
        };
        this.html = document.createElement('div');
    }




    render() {
        const headerTitle = this.headerTitle;
        const bodyTitle = this.bodyTitle;
        const buttonName = this.buttonName;
        this.html.innerHTML = `<div class="modal fade" id="confirm-buyer-detail" role="dialog" >
        <div class="modal-dialog" style="width: 440px">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #5cb85c;border-top-right-radius: 5px;border-top-left-radius: 5px;" >
                    <h3 class="modal-title" style="color: white;font-weight: bold">${headerTitle}</h3>
                    <button type="button" style="position: absolute;right: 10px;top: 10px;" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${bodyTitle}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" data-dismiss="modal" id="btn-confirm-buyer-detail" class="btn btn-danger">${buttonName}</button>
                </div>
            </div>
        </div>
    </div>`;
        const self = this;
        this.html.querySelector('#btn-confirm-buyer-detail').addEventListener('click', function () {
            self.event.onBtnConfirmClickedCallApi();
        });

    }

    get domElement() {
        return this.html;
    }
}

//export default CreditCardComponent

export { ConfirmDialogConfirmBuyerDetail }