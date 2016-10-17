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
        <title><?php wp_title(); ?></title>
        <meta name="description" content="<?php bloginfo('description'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
         <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() ?>/style.css">
      <link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/navigation.css">
      <link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/start.css">
      <!--<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/pricing.css">-->

      
 
<link rel="apple-touch-icon" sizes="57x57" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="<?php echo get_stylesheet_directory_uri(); ?>/favicon//android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon/favicon-16x16.png">
<link rel="manifest" href="<?php echo get_stylesheet_directory_uri(); ?>//manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="<?php echo get_stylesheet_directory_uri(); ?>/favicon/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">
      
        
          <style>
            body {
               padding-top: 70px;
         
            }
        </style>
      
        
        <!--Feature DEtection of browsers is made with modernizr-->
        <script src="<?php echo get_stylesheet_directory_uri() ?>/js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script> 
        
       
        
        
 <?php wp_enqueue_script("jquery"); ?>   
 <?php wp_head();?>
          <script src="<?php echo get_stylesheet_directory_uri() ?>/js/vendor/typed.min.js"></script>
    </head>
    <body>
        


<!-- Google Tag Manager -->

<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-PK5KL4"

height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':

new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],

j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=

'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);

})(window,document,'script','dataLayer','GTM-PK5KL4');</script>
<!-- End Google Tag Manager -->
        
        
        
        
        
         <div class="wrapper">
        
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

      
 <nav   class="navbar navbar-fixed-top navbar-custom-first box_blur_bottom" role="navigation">
      <div class="container  navbar-custom-first">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
            <a class="navbar-brand" href="/"><img alt="mailtastic.de" style="height:100%;" src="https://www.mailtastic.de/img/common/Logo-Blau.png"></a>
      </div>
        <div id="navbar" class="navbar-collapse collapse">
        	
<!--            <ul class="nav navbar-nav navbar-left">
                 <li  ng-class="getClass('/start')"><a class="closeonclick" href="#/start">ÜBERSICHT</a></li>
                 <li ng-class="getClass('/produkt')"><a  class="closeonclick" href="#/produkt" style="cursor:pointer;"  >PRODUKT</a></li>
                 <li ng-class="getClass('/preise')" ><a class="closeonclick"  href="#/preise">PREISE</a></li>
                 <li><a href="https://www.mailtastic.de/#/start?pos=contact" style="cursor:pointer;"  >KONTAKT</a></li>
                 <li ng-class="getClass('/kontakt')"><a class="closeonclick"  href="#/kontakt" style="cursor:pointer;"  >KONTAKT</a></li>
                 <li ng-class="getClass('/cebit')"><a class="closeonclick"  href="#/cebit" style="cursor:pointer;"  >CeBIT</a></li>
            </ul>   -->
            
            
            <ul class="nav navbar-nav navbar-left">
                <li  ng-class="getClass('/start')"><a class="closeonclick" href="/">ÜBERSICHT</a></li>
                <li class="dropdown hilfe" ng-class="getClassHelp()">
                    <a style="cursor:pointer;" ui-sref-active="active" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">PRODUKT <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li  class="menudropdownentry" ><a class="closeonclick" href="/wordpress/kampagnen-management">Kampagnen-Management</a></li>
                        <li  class="menudropdownentry" ><a class="closeonclick" href="/wordpress/signaturverwaltung">Signatur-Management</a></li>
                        <li  class="menudropdownentry" ><a class="closeonclick"  href="/wordpress/clients">Clients & Integration</a></li>
                        <li class="menudropdownentry" ><a class="closeonclick" href="/wordpress/sicherheit">Sicherheit</a></li>
                       <li class="menudropdownentry" ><a class="closeonclick" href="/signatur-banner-galerie">Banner-Galerie</a></li>
                         <li class="menudropdownentry" ><a class="closeonclick" href="/preise">Preise</a></li>
                    </ul>
                </li>
            </ul>
            
            <?php
             //get alle entrys from main menu
                wp_nav_menu(array(
                    'theme_location' => 'hauptmenue',
                    'menu_class' => 'nav  navbar-nav navbar-left',
                     // OWN CUSTOM WALKER
                    'walker' => new Custom_Walker_Nav_Menu
                 ));
            ?>
            
            
            <ul style="padding-left : 15px;" class="nav navbar-nav navbar-right">
                 <li class="cursor-pointer" > 
                     <a style="padding-left : 0;" href="https://www.app.mailtastic.de/#/login" >EINLOGGEN</a>     
                </li>
                 <li class="navbuttonli" >         <button style="padding-left:20px;padding-right : 20px;font-weight : 500;letter-spacing : 0.7px;" onclick="location.href='https://www.app.mailtastic.de/#/register';" type="button" class="btn actionbutton_green">JETZT TESTEN!</button>
                </li>
            </ul>
        </div>
      </div>
    </nav>
