jQuery(document).ready(function($){

		
		$('.ttshowcase_masonry').each(function() {

			var currentmason = $(this);

			currentmason.imagesLoaded( function() {

				currentmason.masonry({
				 
					itemSelector: '.ttshowcase_rl_box'
				 
				});

			});

		});



});

var ttmasonryUpdate = function() {
   
   	 jQuery('.ttshowcase_masonry').masonry();


}