document.addEventListener("DOMContentLoaded", () => {
    var myInput = document.getElementById("input");
    if(myInput.addEventListener ) {
        myInput.addEventListener('keydown',keyHandler,false);
    } else if(myInput.attachEvent ) {
        myInput.attachEvent('onkeydown',keyHandler); /* damn IE hack */
    }
    
    function keyHandler(e) {
        var TABKEY = 9;
        if(e.keyCode == TABKEY) {
            this.value += "    ";
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        }
    }
});