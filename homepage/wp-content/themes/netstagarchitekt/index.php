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
        <div class="sliderwrapper" >
<?php 


if(have_posts()) :
     
    while(have_posts()) : the_post();
apply_filters( 'the_content', the_content() );  
    endwhile;
endif;
?>  
  </div>   
 <?php //get_sidebar(); ?>
   <?php get_footer(); ?>

            