let source = null; // Store the source outside the click handler

function validateInput(inputElement) {
    var warningText = document.getElementById('inputHelp');
    if (inputElement.value.includes(' ')) {
        inputElement.value = inputElement.value.trim().split(' ')[0];
        warningText.classList.remove('d-none');
    } else {
        warningText.classList.add('d-none');
    }
}




let isShown = false;




$(document).ready(function () {
    $('#submitButton').on('click', function (e) {
        $("#hashtag-output").css('height', $("#hashtag-output").prop('scrollHeight') + 'px');

        console.log('clicked');
        if (source) {
            source.close(); // Close the previous connection
        }



        e.preventDefault();
        if (!isShown) {
            $('#hashtag-output_div').toggleClass('d-none');
            isShown = true;

        }
        $("#hashtag-output").val("");

        var inputText = $('#tagInput').val();
        $('#tagInput').val("");

        source = new EventSource("/gettags/" + inputText);

        source.onmessage = function (event) {
            console.log(event.data);

            if (event.data == '[DONE]') {
                source.onmessage = null; // Remove the event handler
                source.close();
                console.log('done');
            } else {
                var textarea = $("#hashtag-output");
                textarea.val(textarea.val() + event.data);
                textarea.css('height', textarea.prop('scrollHeight') + 'px');

            }
        };



    });
});






