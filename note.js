var n = 1;

var new_note = function(div) {
    var str = "<div id='test" + n++ + "' class='draggables'> <textarea class='divtext'></textarea></div>";
    $(str).appendTo(div);
    $(document).ready(function() {
        $(".draggables").draggable();
    });
};
    
