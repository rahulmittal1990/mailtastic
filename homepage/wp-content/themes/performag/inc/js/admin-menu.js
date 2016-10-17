jQuery(document).ready(function ($) {

    jQuery('#menu-to-edit').bind('sortstop', function (event, ui) {
        var element = jQuery(ui.item);
        var parent = element.prev('.menu-item-depth-0');
        if (parent.hasClass('menu-item-category')) {
            element.addClass('catErr');
        } else {
            element.removeClass('catErr');
        }
    });

    jQuery('.item-post-subcat').hide();

    jQuery('.item-post-gallery input:checked').parent().parent().siblings('.item-post-subcat').show();

    jQuery(document).on('change', '.item-post-gallery input', function () {
        if (jQuery(this).is(':checked')) {
            jQuery(this).parent().parent().siblings('.item-post-subcat').show();
        } else {
            jQuery(this).parent().parent().siblings('.item-post-subcat').hide();
            jQuery(this).parent().parent().siblings('.item-post-subcat').find('input').prop('checked', false);
        }
    });

    jQuery(document).on('DOMNodeInserted', function (e) {
        if (jQuery(e.target).is('.menu-item')) {
            jQuery(e.target).find('.menu-item-extended-heading, .menu-item-extended-columns, .item-post-subcat').hide();
        }
    });

});