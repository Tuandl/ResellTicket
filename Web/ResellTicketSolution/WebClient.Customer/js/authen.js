// function checkLogin(){
//     var username = localStorage.getItem('USERNAME');
//     var isLoggin = document.getElementById("isLoggin");
//     var showingOption = document.getElementById("showing-option");
//     var welcomeName = document.getElementById("welcome-name");
//     if(username !== null){
//         welcomeName.textContent = username;
//         isLoggin.style.display = 'none';
//         showingOption.style.display = 'block';
//     } else {
//         isLoggin.style.display = 'block';
//         showingOption.style.display = 'none';
//     }
// }
function checkLoginProfile(){
    var username = localStorage.getItem('USERNAME');
    if(username === null){
        window.location.href = 'index.html';   
    }
}

function logout(){
    localStorage.clear();
}