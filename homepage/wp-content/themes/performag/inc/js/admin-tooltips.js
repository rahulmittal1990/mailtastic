jQuery(document).ready(function () {
    jQuery('.tooltips').powerTip({
        placement: 'n', mouseOnToPopup: true
    });

    var custom_uploader;

    jQuery(document).on('click', 'input[type=button].thrive-select-image', function (e) {

        e.preventDefault();

        if (custom_uploader) {
            custom_uploader.open();
            return;
        }

        //Extend the wp.media object
        custom_uploader = wp.media.frames.file_frame = wp.media({
            title: 'Choose Image',
            button: {
                text: 'Choose Image'
            },
            multiple: false
        });

        //When a file is selected, grab the URL and set it as the text field's value
        var image = jQuery(this).siblings('input[type=text]');
        custom_uploader.on('select', function () {
            attachment = custom_uploader.state().get('selection').first().toJSON();
            image.val(attachment.url);
        });

        //Open the uploader dialog
        custom_uploader.open();
    });
});