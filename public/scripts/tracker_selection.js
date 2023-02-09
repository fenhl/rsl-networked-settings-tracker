let selected_tracker = null;
let room_id = null;

$(document).ready(function(){
    // Clicking tracker selection button
    $('button').not('#init_button').click(function() {
        let tid = $(this).attr('id');
        $('button').removeClass('selected');
        $(this).addClass('selected');
        $('#error_layout').hide();
        selected_tracker = tid;
        update_link();
    });

    // Set input event for the tracker id input box
    $('#room_id').on('input', function(event) {
        room_id = $("#room_id").val();
        room_id = room_id.replace(/\W/g, '');
        if (room_id === "") { room_id = null; }
        update_link();
    });

});

// Update the clickable link if either the roomname or selected tracker changes
function update_link() {
    const newurl = '/'.concat(selected_tracker, '/', room_id);

    // Reset to invalid
    $("#init_url").removeAttr("href");
    $('#init_button').removeClass('ready');
    $('#init_button').addClass('notready');
    $('#error_length').show();

    // Validate
    if(room_id == null || room_id.length < 5) { return; }
    else { $('#error_length').hide(); }
    if(selected_tracker == null) { return; }

    // Update the button link
    $('#init_button').removeClass('notready');
    $('#init_button').addClass('ready');
    $("#init_url").attr("href", newurl);
}
