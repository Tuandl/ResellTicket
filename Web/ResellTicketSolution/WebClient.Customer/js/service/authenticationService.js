function isLogedin() {
    var username = localStorage.getItem('USERNAME');
    return username !== null;
}

// function checkLogin(){
//     var username = localStorage.getItem('USERNAME');
//     var isLoggin = document.getElementById("isLoggin");
//     var showingOption = document.getElementById("showing-option");
//     var welcomeName = document.getElementById("welcome-name");
//     if(username !== null){
//         welcomeName.textContent =  username;
//         isLoggin.style.display = 'none';
//         showingOption.style.display = 'block';
//     } else {
//         isLoggin.style.display = 'block';
//         showingOption.style.display = 'none';
//     }
//}

function checkLoginProfile(){
    var username = localStorage.getItem('USERNAME');
    if(username === null){
        window.location.href = 'index.html';   
    }
}

function logout(){
    localStorage.clear();
}

function getUserInformation() {
    return {
        username: localStorage.getItem('USERNAME'),
        fullName: localStorage.getItem('FULLNAME'),
        phoneNumber: localStorage.getItem('PHONENUMBER'),
        userId: localStorage.getItem('ID'),
    }
}

const authenticationService = {
    checkLoginProfile,
    logout,
    isLogedin: isLogedin,
    getUserInformation,
}

export {
    authenticationService
}