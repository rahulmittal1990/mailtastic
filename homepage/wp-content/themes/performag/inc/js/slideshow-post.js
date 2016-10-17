if (ThriveSlideshowOptions === undefined) {
    var ThriveSlideshowOptions = {};

}
ThriveSlideshowOptions.img_textfield = false;
jQuery(document).ready(function () {
    jQuery("#tt-btn-add-new-slide").click(ThriveSlideshowOptions.add_new_slide);
    ThriveSlideshowOptions.display_slide_list_indexes();
    ThriveSlideshowOptions.bind_slide_items_actions();

    jQuery("#publish, #save-post").one('click', function (event) {
        //event.preventDefault();
        jQuery("#thrive_hidden_meta_slideshow_items").val(JSON.stringify(ThriveSlideshowOptions.build_items_object()));
        //jQuery("#publish").trigger('click');
    });

});

ThriveSlideshowOptions.add_new_slide = function () {
    var _clone_row = jQuery("#tt-item-clone-row").clone();
    _clone_row.attr("id", "");
    _clone_row.show();
    //close any other opened items
    jQuery(".tt-slide-item-table").hide();
    _clone_row.find(".tt-slide-item-table").show();

    jQuery("#tt-item-list-container").append(_clone_row);
    ThriveSlideshowOptions.bind_slide_items_actions();
    ThriveSlideshowOptions.display_slide_list_indexes();
};

ThriveSlideshowOptions.remove_slide = function () {
    jQuery(this).parents(".tt-slide-item-row").remove();
    ThriveSlideshowOptions.bind_slide_items_actions();
};

ThriveSlideshowOptions.bind_slide_items_actions = function () {
    jQuery(".tt-item-remove-btn").unbind().click(ThriveSlideshowOptions.remove_slide);
    jQuery(".tt-item-toggle-table").unbind().click(ThriveSlideshowOptions.toggle_display_items_options);
    jQuery(".tt-item-img-btn").unbind().click(ThriveSlideshowOptions.handle_file_upload);
};

ThriveSlideshowOptions.build_items_object = function () {
    var _ads_obj = [];
    jQuery("#tt-item-list-container").find(".tt-slide-item-row").each(function (index) {
        var _temp_item = {
            title: jQuery(this).find(".tt-item-title").val(),
            description: jQuery(this).find(".tt-item-description").val(),
            image: jQuery(this).find(".tt-item-img").val(),
            source_url: jQuery(this).find(".tt-item-source-url").val(),
            source_text: jQuery(this).find(".tt-item-source-text").val(),
            id: jQuery(this).find(".tt-item-id").val()
        };
        _ads_obj.push(_temp_item);
    });
    return _ads_obj;
};

ThriveSlideshowOptions.toggle_display_items_options = function () {
    var _current_item_visible = jQuery(this).parents(".tt-slide-item-row").find(".tt-slide-item-table").is(":visible");
    jQuery(".tt-slide-item-table").hide();
    if (!_current_item_visible) {
        jQuery(this).parents(".tt-slide-item-row").find(".tt-slide-item-table").show();
    }
};

ThriveSlideshowOptions.display_slide_list_indexes = function () {
    jQuery("#tt-item-list-container").find(".tt-slide-item-row").each(function (index) {
        jQuery(this).find(".tt-item-index-label").html("Slide #" + (index + 1));

    });
};

//deal with the file upload
var file_frame;
ThriveSlideshowOptions.handle_file_upload = function (event) {
    ThriveSlideshowOptions.img_textfield = jQuery(this);
    event.preventDefault();
    if (file_frame) {
        file_frame.open();
        return;
    }
    file_frame = wp.media.frames.file_frame = wp.media({
        title: jQuery(this).data('uploader_title'),
        button: {
            text: jQuery(this).data('uploader_button_text')
        },
        multiple: false
    });
    file_frame.on('select', function () {
        attachment = file_frame.state().get('selection').first().toJSON();
        if (ThriveSlideshowOptions.img_textfield) {
            ThriveSlideshowOptions.img_textfield.parents("td").find(".tt-item-img").val(attachment.url);
            ThriveSlideshowOptions.img_textfield.parents("td").find("img").attr("src", attachment.url);
        }
    });
    file_frame.open();
};