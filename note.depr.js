$(function() {
    var new_note = function() {
        $('.container').append(
        "<div id='test' class='draggables'> <textarea class='divtext'></textarea></div>");
        $(function() {
            $(".draggables").draggable({ snap : true });
        });
    };
    
    var n = 5;
    var progress = function() {
        $('.bars').progressbar({
            value: n += 5
        })
    };

    $(".buttons").button();
    $(".buttons").click(progress);

    var new_button = function() {
        $('.many-buttons').append(
        "<br><button class='buttons1'><span class='button-test'> Clone Myself</span></button>");
        $(".buttons1").button();
        $(".buttons1").click(new_button);
    };
    $(".buttons1").button();
    $(".buttons1").click(new_button);
});
