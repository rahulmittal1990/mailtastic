<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the "site-content" div and all content after.
 *
 * @package WordPress
 * @subpackage Twenty_Fifteen
 * @since Twenty Fifteen 1.0
 */
?>
 <div class="push"></div>
 </div>
	<footer>
            <div class="container">
                   <a style="margin-left : 30px;" class="closeonclick" href="#/start"><span class="navigationspan">IMPRESSUM</span></a>
                    <a class="closeonclick" href="#/start"><span class="navigationspan">AGB</span></a>
            </div>
         
        </footer>
    <!--</div>  /container -->        
         <script src="<?php echo get_stylesheet_directory_uri() ?>/js/vendor/bootstrap.min.js"></script>
         
         <?php
function my_scripts_method() {
    wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js');
    wp_enqueue_script( 'jquery' );
}    

add_action('wp_enqueue_scripts', 'my_scripts_method');
?>
         
         
 <script src="<?php echo get_stylesheet_directory_uri() ?>/js/main.js"></script>
       

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X','auto');ga('send','pageview');
        </script>
        <?php wp_footer();?>
    </body>
</html>
