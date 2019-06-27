import { appConfig } from "../../constant/appConfig.js";

function generateRandomId() {
    return Math.floor((Math.random() * appConfig.MAX_RANDOM_ID) + 1);
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList} 
 */
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

const commonService = {
    generateRandomId: generateRandomId,
    removeAllChildren: removeAllChildren,
    htmlToElement,
    htmlToElements
};

export default commonService