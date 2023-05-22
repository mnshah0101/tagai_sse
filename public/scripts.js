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
function resizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}



$(document).ready(function () {
    $('#getTagsForm').on('submit', function (e) {
        if (isShown) {
            $('#hashtag-output_div').toggleClass('d-none');
            isShown = false;
        }
        e.preventDefault();
        $('#loading-spinner').toggleClass('d-none');

        var inputText = $('#tagInput').val();
        $.ajax({
            url: '/gettags/' + inputText,
            type: 'GET',
            success: function (data) {
                console.log('Success:', data);
                $('#hashtag-output_div').toggleClass('d-none');
                isShown = true;


                $('#hashtag-output').val(data);


                var textarea = $('#hashtag-output')[0];
                resizeTextarea(textarea);


                $('#loading-spinner').toggleClass('d-none');
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    });
});

$(document).ready(function () {
    $('#hashtag-output').on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

