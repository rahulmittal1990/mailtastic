<?php
/*
Template Name: Startseite

*/
?>
<?php get_header(); ?>


<?php 
//if(have_posts()) :
//    while(have_posts()) : the_post(); ?>
        <!--<div class="container">-->
        <!--<h2>//<?php the_title(); ?></h2>-->
       

      <?php the_content('Weiterlesen'); 
//        echo  '</div>';
//    endwhile;
//endif;
?>    

   
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="home_top_area">
        <img class="mainimage" src="<?php echo get_bloginfo('template_directory');?>/img/home/top_title.jpg" >
        
        <div class="container topleftcontainer">
                 <img class="top_left hidden-xs hidden-sm" src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/topleft.png" >
    
        </div>
        
         <div class="top_right hidden-xs hidden-sm">
            Die Gesellschaft hat aus dem konkreten kommunalen, gesellschaftlichen Bedarf an Wohnfläche ein modulares Bauen mit Ressourcenschonenden Materialien entwickelt.
         </div>
    </div>
    <div class="container-fluid hidden-md hidden-lg infocontainer">
        <div class="row-fluid">
            <div class="col-sm-7 col-xs-12 left">
               <img src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/topleft.png" >
            </div>
             <div class="col-sm-5 col-xs-12 right">
                <div>
                    Die Gesellschaft hat aus dem konkreten kommunalen, gesellschaftlichen Bedarf an Wohnfläche ein modulares Bauen mit Ressourcenschonenden Materialien entwickelt.
                </div>
            </div>
        </div>
    </div>
    

    <div class="container kacheln">
      <!-- Example row of columns -->
      <div class="row">
        <div class="kachel col-lg-4 col-md-4 col-sm-6 col-xs-12">
            <img  src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/1.png" >
         </div>
        <div class="kachel col-lg-4 col-md-4 col-sm-6 col-xs-12">
            <a href="/galerie?slide=0"><img  src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/2.png" >  </a>
        </div>
        <div class="kachel col-lg-4 col-md-4 col-sm-6 col-xs-12">
          <a href="/galerie?slide=1"><img  src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/3.png" >  </a>
        </div>
           <div class="clearfix visible-lg-block visible-md-block"></div>
           <div class="kachel col-lg-4 col-md-4 col-sm-6 col-xs-12">
            <a href="/galerie?slide=2"><img  src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/4.png" >  </a>
         </div>
        <div class="kachel col-lg-4 col-md-4 col-sm-6 col-xs-12">
            <img  src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/5.png" >
        </div>
        <div class="kachel col-lg-4 col-md-4 col-sm-6 col-xs-12">
            <img   src="<?php echo get_bloginfo('template_directory');?>/img/home/kacheln/6.png" >
        </div>
          
          
       
      </div>
  </div>
      <hr class="homepage">
     
     
      
      
 <?php //get_sidebar(); ?>
   <?php get_footer(); ?>
