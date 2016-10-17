<?php
/**
 * The template for displaying the header
 *
 * Displays all of the head element and everything up until the "site-content" div.
 *
 * @package WordPress
 * @subpackage Twenty_Fifteen
 * @since Twenty Fifteen 1.0
 */
?><!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?php bloginfo('name'); ?><?php wp_title(); ?></title>
        <meta name="description" content="<?php bloginfo('description'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
         <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() ?>/style.css">
      

        
          <style>
            body {
               padding-top: 70px;
         
            }
        </style>
      
        <script src="<?php echo get_stylesheet_directory_uri() ?>/js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
 <?php wp_enqueue_script("jquery"); ?>   
 <?php wp_head();?>
    </head>
    <body>
         <div class="wrapper">
        
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
   <nav class="navbar navbar-custom-first navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <!--<a class="navbar-brand" href="#">Home</a>-->
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            
            <?php
                wp_nav_menu(array(
                    'theme_location' => 'hauptmenue',
                    'menu_class' => 'nav  navbar-nav navbar-left',
                     // OWN CUSTOM WALKER
                    'walker' => new Custom_Walker_Nav_Menu
                 ));
            ?>
            
<!--            <ul class="nav navbar-nav navbar-left">
                <li ><a style="padding-left : 5px;" class="closeonclick" href="#/start"><span class="navigationspan">START</span></a></li>
                 <li><a  class="closeonclick" href="#/produkt" style="cursor:pointer;"  ><span class="navigationspan">KONZEPT</span></a></li>
                 <li><a class="closeonclick"  href="#/preise"><span class="navigationspan">NACHHALTIGKEIT</span></a></li>
                 <li><a class="closeonclick"  href="#/preise"><span class="navigationspan">GALERIE</span></a></li>
                 <li><a class="closeonclick"  href="#/kontakt" style="cursor:pointer;"><span class="navigationspan">KONTAKT</span></a></li>
            </ul>   -->
            
         
        </div><!--/.navbar-collapse -->
      </div>
    </nav>