
document.addEventListener("DOMContentLoaded", function() {
 
  

  var snippet = '<div class="slidercounter"><span class="slidercountercurrent">02</span><span class="slidercountertotal"> / 11</span></div>';
//  setTimeout(function(){ 
      jQuery(document).ready(function($) {
       
         var slieder =   $('.master-slider-parent');
         slieder.append(snippet); 
         
         var m=masterslider_instances; 
         if(m.length !== 1){
             
         }else{
            var slider = m[0];
            var amountOfSlides = slider.api.count();
            $(".slidercountertotal").text(" / " +amountOfSlides);
            var currentSlide = slider.api.index();  
            $(".slidercountercurrent").text(currentSlide+1); 
            slider.api.addEventListener(MSSliderEvent.CHANGE_START , function(){
                // dispatches when the slider's current slide change starts.
                var amountOfSlides = slider.api.count();
                $(".slidercountertotal").text(" / " +amountOfSlides);
                
                var currentSlide = slider.api.index();  
                $(".slidercountercurrent").text(currentSlide+1);
                
            });
            
            
            //get get params for specific slider image
            var params = getSearchParameters();
            if(params['slide']){
                 slider.api.gotoSlide(params['slide']); 
            }
           
            
            setTimeout(function(){
                  //calculate width of thumbnail
                    var currentWidth =  $('.master-slider').width();
                    var newWidth = currentWidth + 270;
                    $('.ms-thumb-list').width(newWidth);
                
            }, 500);
          
            
         }
        
      });
     
  
//  }, 5000);
  
  
  
  
});



function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

