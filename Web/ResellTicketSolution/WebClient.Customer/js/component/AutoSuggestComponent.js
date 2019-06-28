import commonService from "../service/commonService.js";
// import { } from './AutoSuggestComponentStyle.css';

class AutoSuggestComponent {

    id = commonService.generateRandomId();
    model = {};

    constructor(containerId, onCallApi, onSeleted, placeholder, classList, containerClassList) {
        this.model.containerId = containerId;
        this.model.container = document.getElementById(containerId);

        this.model.innerContainer = commonService.htmlToElement(`<div class="autocomplete-container ${containerClassList}"></div>`);
        this.model.container.appendChild(this.model.innerContainer);

        this.model.inputDom = commonService.htmlToElement(`<input id="${this.id}" class="${classList}" type="text" placeholder="${placeholder}">`);
        this.model.innerContainer.appendChild(this.model.inputDom);

        this.event = {
            onCallApi,
            onSeleted
        };

        this.addActive = this.addActive.bind(this);
        this.closeAllLists = this.closeAllLists.bind(this);
        this.removeActive = this.removeActive.bind(this);

        this.init();
    }

    init() {
        const inputDom = this.model.inputDom;
        const self = this;

        inputDom.addEventListener("input", async function (e) {
            var val = this.value;

            const results = await self.event.onCallApi(val);

            /*close any already open lists of autocompleted values*/
            self.closeAllLists();
            if (!val) { return false; }
            self.currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            const itemsContainer = document.createElement("DIV");
            itemsContainer.setAttribute("id", self.id + "autocomplete-list");
            itemsContainer.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(itemsContainer);
            /*for each item in the array...*/
            results.forEach((item) => {
                /*create a DIV element for each matching element:*/
                const itemElement = document.createElement("DIV");
                itemElement.innerHTML = `${item.name}`;
                /*insert a input field that will hold the current array item's value:*/
                itemElement.innerHTML += `<input type='hidden' value='${JSON.stringify(item)}'>`;
                /*execute a function when someone clicks on the item value (DIV element):*/
                itemElement.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    const data = JSON.parse(this.getElementsByTagName("input")[0].value);

                    inputDom.value = data.name;
                    self.event.onSeleted(data);
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    self.closeAllLists();
                });
                itemsContainer.appendChild(itemElement);
            })
        });

        /*execute a function presses a key on the keyboard:*/
        inputDom.addEventListener("keydown", function (e) {
            const itemsContainer = document.getElementById(this.id + "autocomplete-list");
            let items = undefined;
            if (itemsContainer) items = itemsContainer.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                self.currentFocus++;
                /*and and make the current item more visible:*/
                self.addActive(items);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                self.currentFocus--;
                /*and and make the current item more visible:*/
                self.addActive(items);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (self.currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (items) items[self.currentFocus].click();
                }
            } else if (e.keyCode == 9) {
                /*If the TAB key is pressed, prevent the form from being submitted,*/
                // e.preventDefault();
                if(self.currentFocus < 0) self.currentFocus = 0;
                /*and simulate a click on the "active" item:*/
                if (items) items[self.currentFocus].click();
            }
        });

        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            self.closeAllLists(e.target);
        });
    }

    addActive(items) {
        /*a function to classify an item as "active":*/
        if (!items) return false;
        /*start by removing the "active" class on all items:*/
        this.removeActive(items);
        if (this.currentFocus >= items.length) this.currentFocus = 0;
        if (this.currentFocus < 0) this.currentFocus = (items.length - 1);
        /*add class "autocomplete-active":*/
        items[this.currentFocus].classList.add("autocomplete-active");
    }

    removeActive(items) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }
    }

    closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        const items = this.model.container.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < items.length; i++)
            if (elmnt != items[i] && elmnt != this.model.inputDom) {
                items[i].parentNode.removeChild(items[i]);
            }

        // items.forEach((item) => {
        //     if (elmnt != item && elmnt != this.model.inputDom) {
        //         item.parentNode.removeChild(item);
        //     }
        // })
    }

}

export default AutoSuggestComponent;