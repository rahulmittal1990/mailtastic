setTimeout(function(){
    (function ($) {
        $('#side-nav').metisMenu();

        $(function () {
            $('[data-toggle="popover"]').popover();
        });

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });

        $(".mobile-menu-icon").click(function (event) {
            event.preventDefault();
        });

        var $window = $(window), $container = $('div.page-container');

        $(".sidebar-collapse-icon").click(function (event) {
            event.preventDefault();
            $container.toggleClass('sidebar-collapsed').toggleClass('can-resize');

            /*if ($container.hasClass('can-resize')) {
             setTimeout(function () {
             $container.removeClass('can-resize');
             }, 500);
             } else {
             setTimeout(function () {
             $container.addClass('can-resize');
             }, 500);
             }*/
        });

        var $is_collapsed = false;
        if ($container.hasClass('sidebar-collapsed')) {
            $is_collapsed = true;
        }
        $window.resize(function resize() {

            var window_width = $window.outerWidth();
            if (window_width < 951 && window_width > 767) {
                if ($container.hasClass('can-resize') === false) {
                    $container.addClass('sidebar-collapsed');
                }
            } else if (window_width < 767) {
                $container.removeClass('sidebar-collapsed');
                $container.removeClass('can-resize');
            } else {
                if ($container.hasClass('can-resize') === false && $is_collapsed === false) {
                    $container.removeClass('sidebar-collapsed');
                }
            }

        }).trigger('resize');

        $('body').on('click', '.panel > .panel-heading > .panel-tool-options li > a[data-rel="reload"]', function (ev)
        {
            ev.preventDefault();

            var $this = $(this).closest('.panel');

            $this.block({
                message: '',
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#fff',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff',
                    width: '50%'
                },
                overlayCSS: {backgroundColor: '#FFF'}
            });
            $this.addClass('reloading');

            setTimeout(function ()
            {
                $this.unblock();
                $this.removeClass('reloading');
            }, 900);

        })

    })(jQuery);

}, 5000);


