/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * 
 * @type @call;$@call;appendTo|@call;$@call;appendTo|@call;$@call;appendToAfter an update of chrome the positioning of tooltip did not work any more
 * Now the positioning is handled with absolute positioning in every browser (was only in firefox before)
 */
        
//        /**
//         * Tooltips for line graph
//         */
var $tooltip = $('.tooltip-linegraph').appendTo($('#linegraph'));

$(document).on('mouseenter', '.ct-point', function() {
var tooltips = $(".tooltip-hidden");
if(tooltips.length < 2){
    
    var toolTipHtml = $(".tooltipwrapper").html();
    
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    if(true  || isFirefox === true){ //global positioning necessary         EDIT: In every browser the positionigng is now like in firefox
        
         $tooltip = $(toolTipHtml).appendTo($("body"));     //im firefox gibts probleme mit dem graphen und parent container deshalb wird es absolut im body posiitonert
    }else{
         $tooltip = $(toolTipHtml).appendTo($('#linegraph'));
    }
    
   
}

   var currentObject = $(this);
   var series = $(this).closest('.ct-series');
   var seriesName = series.attr('ct:series-name');
   var seriesMeta = series.attr('ct:meta');
   seriesMeta = Chartist.deserialize(seriesMeta);
   
//    var value = currentObject.attr('ct:value');
    var meta = currentObject.attr('ct:meta');
    meta = Chartist.deserialize(meta);
    
//    meta = JSON.parse(meta);
    
    var label = meta.label;
    var impressions = meta.impressions;
    var clicks = meta.clicks;
    var rate = (impressions === 0 || clicks === 0) ? 0 : (clicks/impressions*100);
    rate = rate.toFixed(2)
    var color = seriesMeta.color;





$(".tooltip-linegraph .date").text(label);
$(".tooltip-linegraph .impressions").text(impressions);
$(".tooltip-linegraph .clicks").text(clicks);
$(".tooltip-linegraph .rate").text(rate+"%");
$(".tooltip-linegraph .title").text(seriesName);
$(".tooltip-linegraph .dot").css({
    "background-color" : color
});

//  $tooltip.text(seriesName + ': ' + value);
  $tooltip.removeClass('tooltip-hidden');
});

$(document).on('mouseleave', '.ct-point', function() {
  $tooltip.addClass('tooltip-hidden');
});

$(document).on('mousemove', '.ct-point', function(event) {
    //check if browser is firefox
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    if(true || isFirefox === true){ //global positioning necessary EDIT: In every browser the positionigng is now like in firefox
        
        
         var windowwith = $(document).width();
        var offset = 0;
        var position = $(this).offset();
        if(position.left > windowwith-70){
            offset = 30;

            $(".tooltip-linegraph").addClass("rightend");
        }else{
              $(".tooltip-linegraph").removeClass("rightend");
        }


         $tooltip.css({
//            position : "fixed",
            left: position.left - $tooltip.width() / 2 - 10 - offset,
            top: position.top - $tooltip.height() - 30

        });
        
        
        
        
        
    }else{
         //falls es der punkt ganz rechts ist darf der tooltip nicht unsichtbar sein deshalb muss er ein stück nach links geschoben werden
    
        var containerWidth = $(".ct-chart-line").width();
        var offset = 0;
        var position = $(this).position();
        if(position.left > containerWidth-40){
            offset = 30;

            $(".tooltip-linegraph").addClass("rightend");
        }else{
              $(".tooltip-linegraph").removeClass("rightend");
        }


         $tooltip.css({
            left: position.left - $tooltip.width() / 2 - 9 - offset,
            top: position.top - $tooltip.height() - 30

        });
        
         //alte version bei der das fenster mit dem mauszeiger mitgeht 
//  $tooltip.css({
//    left: event.offsetX - $tooltip.width() / 2 -10,
//    top: event.offsetY - $tooltip.height() - 20
//   
//  });
        
    }
    
    
    
  
});
