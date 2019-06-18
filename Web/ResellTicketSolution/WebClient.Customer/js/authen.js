function checkLogin(){
    var username = localStorage.getItem('USERNAME');
    var isLoggin = document.getElementById("isLoggin");
    if(username !== null){
        isLoggin.style.display = 'none';
    }
}