if (ThriveAdsOptions == "undefined") {
    var ThriveAdsOptions = {};
}

jQuery(document).ready(function () {

    jQuery("#sel_thrive_meta_ad_target_by_value_cats").select2();
    jQuery("#sel_thrive_meta_ad_target_by_value_cats").on("change", function (e) {
        var temp_cat_values = JSON.stringify(jQuery("#sel_thrive_meta_ad_target_by_value_cats").val());
        jQuery("#thrive_hidden_meta_ad_target_by_value").val(temp_cat_values);
    });

    jQuery("#sel_thrive_meta_ad_target_by_value_tags").select2();
    jQuery("#sel_thrive_meta_ad_target_by_value_tags").on("change", function (e) {
        var temp_tag_values = JSON.stringify(jQuery("#sel_thrive_meta_ad_target_by_value_tags").val());
        jQuery("#thrive_hidden_meta_ad_target_by_value").val(temp_tag_values);
    });

    ThriveAdsOptions.bind_ad_row_actions();
    ThriveAdsOptions.display_ad_list_indexes();

    jQuery(".tt-meta-ad-target-by-radio").click(ThriveAdsOptions.display_ad_location_fields);

    jQuery(".tt-meta-ad-target-radio").click(ThriveAdsOptions.display_ad_location_fields);

    ThriveAdsOptions.display_ad_location_fields();
    jQuery("#thrive_meta_ad_location").change(ThriveAdsOptions.display_ad_location_fields);
    jQuery("#sel_thrive_meta_ad_location_value_in_content").change(ThriveAdsOptions.display_ad_location_fields);

    jQuery("#tt-btn-add-new-ad").click(ThriveAdsOptions.add_new_ad);

    jQuery("#publish, #save-post").one('click', function (event) {
        event.preventDefault();
        jQuery("#tt-hidden-ad-list-field").val(JSON.stringify(ThriveAdsOptions.build_ads_object()));
        var _selected_location = jQuery("#thrive_meta_ad_location").val();
        if (_selected_location == "in_content") {
            jQuery("#hidden_thrive_meta_ad_location_value").val(jQuery("#sel_thrive_meta_ad_location_value_in_content").val());
        } else if (_selected_location == "blog_or_index") {
            jQuery("#hidden_thrive_meta_ad_location_value").val(jQuery("#sel_thrive_meta_ad_location_value_between_posts").val());
        }
        jQuery(this).trigger('click');
    });

});

ThriveAdsOptions.display_ad_location_fields = function () {
    var _selected_location = jQuery("#thrive_meta_ad_location").val();

    if (_selected_location.indexOf("ad_zone") == 0) {
        _selected_location = 'ad_zone';
    }

    switch (_selected_location) {
        case "in_content":
            jQuery('#tt-meta-ad-target-radio-post').parents('tr').show();
            jQuery('.thrive_ad_targeting_row').show();

            if (jQuery('#tt-meta-ad-target-radio-blog').prop('checked')) {
                jQuery('#tt-meta-ad-target-radio-post').prop("checked", true);
            }
            jQuery('#tt-meta-ad-target-radio-blog').parent().hide();

            jQuery("#tr_thrive_meta_ad_location_value_in_content").show();
            jQuery("#tr_thrive_meta_ad_location_value_blog_view").hide();
            var _selected_position = jQuery("#sel_thrive_meta_ad_location_value_in_content").val();
            if (_selected_position == "after_x_paragraphs" || _selected_position == "after_x_images") {
                jQuery("#thrive_container_ad_location_position").show();
                if (_selected_position == "after_x_paragraphs") {
                    jQuery("#thrive_container_ad_location_position_paragraph").show();
                    jQuery("#thrive_container_ad_location_position_images").hide();
                } else if (_selected_position == "after_x_images") {
                    jQuery("#thrive_container_ad_location_position_paragraph").hide();
                    jQuery("#thrive_container_ad_location_position_images").show();
                }
            } else {
                jQuery("#thrive_container_ad_location_position").hide();
            }
            console.log(jQuery('.tt-meta-ad-target-radio:checked').val());
            if (jQuery('.tt-meta-ad-target-radio:checked').val() == 'page') {
                jQuery('.tt-meta-ad-target-by-radio').parents('tr').hide();
                jQuery('#tr_thrive_meta_ad_target_by_value_cats').hide();
                jQuery('#tr_thrive_meta_ad_target_by_value_tags').hide();
            }
            ThriveAdsOptions.display_ad_target_by_fields();
            break;

        case "blog_or_index":
            jQuery('#tt-meta-ad-target-radio-post').parents('tr').show();
            jQuery('.thrive_ad_targeting_row').show();
            jQuery("#tr_thrive_meta_ad_location_value_blog_view").show();
            jQuery("#tr_thrive_meta_ad_location_value_in_content").hide();
            jQuery('#tt-meta-ad-target-radio-blog').parent().show();
            ThriveAdsOptions.display_ad_target_by_fields();
            break;

        case "slideshow":
            ThriveAdsOptions.display_ad_target_by_fields();
            jQuery('#tt-meta-ad-target-radio-post').parents('tr').hide();
            jQuery("#tr_thrive_meta_ad_location_value_in_content").hide();
            jQuery("#tr_thrive_meta_ad_location_value_blog_view").hide();

            break;

        case "ad_zone":
            jQuery("#tr_thrive_meta_ad_location_value_in_content").hide();
            jQuery("#tr_thrive_meta_ad_location_value_blog_view").hide();
            jQuery('.thrive_ad_targeting_row').hide();
            break;

        default:
            jQuery('#tt-meta-ad-target-radio-post').parents('tr').show();
            jQuery('.thrive_ad_targeting_row').show();
            jQuery("#tr_thrive_meta_ad_location_value_blog_view").hide();
            jQuery("#tr_thrive_meta_ad_location_value_in_content").hide();
            jQuery('#tt-meta-ad-target-radio-blog').parent().show();
            ThriveAdsOptions.display_ad_target_by_fields();
    }

    jQuery('.tt-ad-item-table').hide();

    ThriveAdsOptions.check_ad_location();
};

ThriveAdsOptions.display_ad_target_by_fields = function () {
    if (jQuery('.tt-meta-ad-target-radio:checked').val() == 'page' && jQuery("#thrive_meta_ad_location").val() != 'slideshow') {
        jQuery('.tt-meta-ad-target-by-radio').parents('tr').hide();
        jQuery('#tr_thrive_meta_ad_target_by_value_cats').hide();
        jQuery('#tr_thrive_meta_ad_target_by_value_tags').hide();
    } else {
        jQuery('.tt-meta-ad-target-by-radio').parents('tr').show();
        var _selected_target = jQuery(".tt-meta-ad-target-by-radio:checked").val();
        if (_selected_target == "categories") {
            jQuery("#tr_thrive_meta_ad_target_by_value_cats").show();
            jQuery("#tr_thrive_meta_ad_target_by_value_tags").hide();
        }
        if (_selected_target == "tags") {
            jQuery("#tr_thrive_meta_ad_target_by_value_tags").show();
            jQuery("#tr_thrive_meta_ad_target_by_value_cats").hide();
        }
    }
};

ThriveAdsOptions.add_new_ad = function () {
    var _clone_row = jQuery("#tt-ad-clone-row").clone();
    _clone_row.attr("id", "");
    _clone_row.show();
    var _rand_no = Math.floor((Math.random() * 3000) + 100);
    var _selected_location = jQuery("#thrive_meta_ad_location").val();

    //close any other opened ads
    jQuery(".tt-ad-item-table").hide();
    _clone_row.find(".tt-ad-item-table").show();
    _clone_row.find(".tt-ad-mobile-ad").attr("name", "tt-ad-mobile-ad-" + _rand_no);
    _clone_row.find(".tt-ad-status").attr("name", "tt-ad-status-" + _rand_no);
    if (_selected_location === 'header') {
        ThriveAdsOptions.toggle_mobile_ad_options.call(_clone_row, false);
    }

    jQuery("#tt-ad-list-container").append(_clone_row);
    ThriveAdsOptions.bind_ad_row_actions();
    ThriveAdsOptions.display_ad_list_indexes();

    jQuery('#tt-ad-group-options-table .cloneTooltips').addClass('tooltips').removeClass('cloneTooltips').powerTip({
        placement: 'n', mouseOnToPopup: true
    });

};

ThriveAdsOptions.remove_ad_item = function () {
    jQuery(this).parents(".tt-ad-item-row").remove();
    ThriveAdsOptions.display_ad_list_indexes();
};

ThriveAdsOptions.bind_ad_row_actions = function () {

    jQuery(".tt-ad-remove-btn").unbind().click(ThriveAdsOptions.remove_ad_item);
    jQuery(".tt-ad-mobile-ad").unbind().click(ThriveAdsOptions.display_mobile_ad_options);
    jQuery(".tt-ad-toggle-table").unbind().click(ThriveAdsOptions.toggle_display_ad_options);
    jQuery(".tt-ad-status").unbind().click(ThriveAdsOptions.bind_ad_status_indicator);

};

ThriveAdsOptions.toggle_display_ad_options = function () {
    var item = jQuery(this).parents(".tt-ad-item-row").find(".tt-ad-item-table"),
        _current_item_visible = item.is(":visible"),
        location = jQuery("#thrive_meta_ad_location").val();
    jQuery(".tt-ad-item-table").hide();
    if (!_current_item_visible) {
        item.show();
    }

    ThriveAdsOptions.toggle_mobile_ad_options.call(item, location !== 'header');
};

ThriveAdsOptions.display_mobile_ad_options = function () {
    if (jQuery(this).val() == "on") {
        jQuery(this).parents(".tt-ad-item-row").find(".tt-mobile-ad-size-row").show();
        jQuery(this).parents(".tt-ad-item-row").find(".tt-mobile-ad-embed-code-row").show();
        jQuery(this).parents(".tt-ad-item-row").find(".tt-mobile-ad-make-default-row").show();
    } else {
        jQuery(this).parents(".tt-ad-item-row").find(".tt-mobile-ad-size-row").hide();
        jQuery(this).parents(".tt-ad-item-row").find(".tt-mobile-ad-embed-code-row").hide();
        jQuery(this).parents(".tt-ad-item-row").find(".tt-mobile-ad-make-default-row").hide();
    }
};

ThriveAdsOptions.toggle_mobile_ad_options = function (show) {
    if (show === true) {
        jQuery(this).find('.tt-ad-mobile-option-wrapper').show();
    } else {
        jQuery(this).find('.tt-ad-mobile-option-wrapper').hide();
    }
};

ThriveAdsOptions.display_ad_list_indexes = function () {
    jQuery("#tt-ad-list-container").find(".tt-ad-item-row").each(function (index) {
        jQuery(this).find(".tt-ad-index-label").html("Ad " + (index + 1));

    });
};

ThriveAdsOptions.build_ads_object = function () {
    var _ads_obj = [];
    jQuery("#tt-ad-list-container").find(".tt-ad-item-row").each(function (index) {
        var _temp_item = {
            name: jQuery(this).find(".tt-ad-name").val(),
            size: jQuery(this).find(".tt-ad-size").val(),
            embed_code: jQuery(this).find(".tt-ad-embed-code").val(),
            mobile: jQuery(this).find(".tt-ad-mobile-ad:checked").val(),
            mobile_size: jQuery(this).find(".tt-mobile-ad-size").val(),
            mobile_embed_code: jQuery(this).find(".tt-mobile-ad-embed-code").val(),
            mobile_default: jQuery(this).find(".tt-chk-make-default-mobile-ad:checked").val() ? 1 : 0,
            status: jQuery(this).find(".tt-ad-status:checked").val(),
            id: jQuery(this).find(".tt-ad-id").val()
        };
        _ads_obj.push(_temp_item);
    });
    return _ads_obj;
};

ThriveAdsOptions.check_ad_location = function () {

    var _post_params = {
        'ad_location': jQuery("#thrive_meta_ad_location").val(),
        'ad_target_in': jQuery(".tt-meta-ad-target-radio:checked").val(),
        'ad_target_by': jQuery(".tt-meta-ad-target-by-radio:checked").val(),
        'ad_target_by_value': jQuery("#thrive_hidden_meta_ad_target_by_value").val(),
        'ad_location_value': "",
        'ad_location_value_position': jQuery("#txt_thrive_ad_location_position").val(),
        'current_ad_group': ThriveAdsOptions.id_post
    };

    var _selected_location = jQuery("#thrive_meta_ad_location").val();
    if (_selected_location == "in_content") {
        _post_params.ad_location_value = jQuery("#sel_thrive_meta_ad_location_value_in_content").val();
    } else if (_selected_location == "blog_or_index") {
        _post_params.ad_location_value = jQuery("#sel_thrive_meta_ad_location_value_between_posts").val();
    }

    jQuery.post(ThriveAdsOptions.checkAdLocationUrl, _post_params, function (result) {
        if (result == 0) {
            jQuery("#tt-check-location-message").html("A problem occured when checking the ad location. Please refresh and try again.");
        } else if (result == 1) {
            jQuery("#tt-check-location-message").html("Another ad group is active for the current location options. Saving this ad will deactivate the other groups for the selected location.");
        } else {
            jQuery("#tt-check-location-message").html("");
        }
    });
};

ThriveAdsOptions.bind_ad_status_indicator = function () {
    var _ad_status = jQuery(this).val();
    if (_ad_status == "active") {
        jQuery(this).parents(".tt-ad-item-row").find(".tt-ad-status-indicator").addClass("tt-ad-active");
    } else {
        jQuery(this).parents(".tt-ad-item-row").find(".tt-ad-status-indicator").removeClass("tt-ad-active");
    }
};
