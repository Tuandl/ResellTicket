import commonService from "../service/commonService.js";

class SelectMultipleComponent {

    id = commonService.generateRandomId();
    model = {};

    constructor(data, containerId, onSeleted, classList) {
        this.model.data = data;

        this.model.containerId = containerId;
        this.model.container = document.getElementById(containerId);

        this.model.selectContainer = commonService.htmlToElement(`<select class="${classList}" id="${this.id}" multiple="multiple"></select>`);
        this.model.container.appendChild(this.model.selectContainer);

        this.event = {
            onSeleted
        };

        this.getSelected = this.getSelected.bind(this);

        this.render();
    }

    render(newData) {
        if(newData) {
            this.model.data = newData;
        }

        let html = '';
        this.model.data.forEach((option) => {
            html += `<option value="${option.value}" ${option.isSelected ? 'selected' : ''}>${option.text}</option>`;
        });

        commonService.removeAllChildren(this.model.selectContainer);
        this.model.selectContainer.innerHTML = html;

        const self = this;

        $(`#${this.id}`).multiselect('destroy');

        $(`#${this.id}`).multiselect({
            buttonWidth: '100%',
            onChange: function (element, checked) {
                const selectedOptions = $(`#${self.id} option:selected`);
                const data = [];
                for(var i = 0; i < selectedOptions.length; i++) {
                    data.push(selectedOptions[i].value);
                }

                if(self.event.onSeleted) {
                    self.event.onSeleted(data);
                }
            }
        });
    }

    getSelected() {
        const selectedOptions = $(`#${this.id} option:selected`);
        const data = [];
        for(var i = 0; i < selectedOptions.length; i++) {
            data.push(selectedOptions[i].value);
        }

        return data;
    }

}

export default SelectMultipleComponent;