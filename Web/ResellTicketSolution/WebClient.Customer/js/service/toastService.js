let TOAST_TIME_OUT = 3000;

function error(message) {
    var body = document.getElementsByTagName('body')[0];

    var element = document.createElement('div');
    element.innerHTML = message;
    element.classList.add('snackbar');
    element.classList.add('snackbar-error');
    body.appendChild(element);

    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
        body.removeChild(element);
    }, TOAST_TIME_OUT);
}

function success(message) {
    var body = document.getElementsByTagName('body')[0];

    var element = document.createElement('div');
    element.innerHTML = message;
    element.classList.add('snackbar');
    element.classList.add('snackbar-success');
    body.appendChild(element);

    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
        body.removeChild(element);
    }, TOAST_TIME_OUT);
}

const toastService = {
    error: error,
    success: success,
    toastTimeOut: TOAST_TIME_OUT,
}

export { toastService }