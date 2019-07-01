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

function getQueryString(paramObject) {
    if (paramObject === null || paramObject === undefined)
        return '';
    let query = Object.keys(paramObject)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(paramObject[k]))
        .join('&');
    return query;
}

function getQueryParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

function createWatch(object, onObjChanged) {
    const handler = {
        set(target, key, value) {
            target[key] = value;
            if(onObjChanged) onObjChanged(key);
            return true;
        },
    };
    return new Proxy(object, handler);
}

const commonService = {
    generateRandomId: generateRandomId,
    removeAllChildren: removeAllChildren,
    htmlToElement,
    htmlToElements,
    getQueryString,
    getQueryParam,
    createWatch,
};

export default commonService