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



<!--MODALS-->




<!-- <script type="text/ng-template" id="campaign_modal_tpl.html"> -->

    <div class="modal fade " id="livedemomodal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content livedemomodal">
    
    <div class="modal-header clearfix">
        <!--<h3 class="modal-title"><span class="glyphicon glyphicon-send" aria-hidden="true"></span> {{modaloptions.heading}}</h3>-->
        
        <div class="cursor-pointer pull-right"  data-dismiss="modal"><span  class="glyphicon glyphicon-remove" aria-hidden="true"></span>  </div>
    </div>
    <div  class="modal-body">
        <div class="row ">
            <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12  textcol" >
                <div class="headline">
                    Live-Demo?
                </div>
                <div class="subtext">
                      Ich führe Sie gerne persönlich durch unser Produkt
                </div>
                <div class="flex-center-left kontaktarea">
                    <img src="https://www.mailtastic.de/img/kontakt/avatare/Avatar_Tao.png"/>
                    <div class="text">
                        <div class="name">Tao Bauer</div>
                        <div class="company">Mailtastic</div>
                    </div>
                </div>
            </div>
            <div  class="col-lg-5 col-md-5 col-sm-12 col-xs-12 formcol" >
                        <form>
                            <div class="form-group">
                                <label >Name*</label>
                                <input id="livedemo_name" type="text" class="form-control" >
                            </div>
                            <div class="form-group">
                                <label >E-Mail*</label>
                                <input id="livedemo_email" type="text" class="form-control" >
                            </div>

                            <div class="form-group">
                                <label >Firma*</label>
                                <input id="livedemo_firma"  type="text" class="form-control"  >
                            </div>
                            <div class="form-group">
                                <label >Wunschdatum</label>
                                <input id="livedemo_date"  type="text" class="form-control"  >
                            </div>
                             <div class="form-group">
                                <label >Uhrzeit</label>
                                <input id="livedemo_time"  type="text" class="form-control"  >
                            </div>
                            
                    </form>
                <button  onclick="sendLiveDemoRequest()" type="button" class="btn btn-lg btn-block actionbutton_green">DEMO ANFORDERN</button>
            </div>
        </div>
    </div>



          </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->




    



<!-- <script type="text/ng-template" id="campaign_modal_tpl.html"> -->

    
    <div class="modal fade " id="personalcontactmodal"  tabindex="-1" role="dialog">
  <div class="modal-dialog  modal-lg">
    <div class="modal-content personalcontactmodal">
    <div class="modal-header clearfix">
        <div data-dismiss="modal"  class="cursor-pointer pull-right" "><span  class="glyphicon glyphicon-remove" aria-hidden="true"></span>  </div>
    </div>
    <div  class="modal-body">
        <div class=" toparea">
            <img src="https://www.mailtastic.de/img/kontakt/avatare/Avatar_Tao.png" />
            <div class="textarea">
                <div class="headline">Ich helfe Ihnen gerne persönlich weiter!</div>
                 <div class="subline">Tao Bauer, Mailtastic</div>
            </div>
        </div>
        <div class="row ">
            <div class="col-lg-4 col-md-4 col-sm-12   col-xs-12">
                <div class="form-group">
                    <label  class="" >Anrede*</label>
                    <select id="personalcontact_anrede" class="form-control">
                        <option>Herr</option>
                        <option>Frau</option>
                        <option>Sonstiges</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="" >Name*</label>
                    <input id="personalcontact_name" type="text" class="form-control"  placeholder="">
                </div>
                <div class="form-group">
                    <label class=""  >E-Mail*</label>
                    <input id="personalcontact_email" type="text" class="form-control"  placeholder="">
                </div>
                <div class="form-group">
                    <label class=""  >Firma</label>
                    <input id="personalcontact_firma" type="text" class="form-control"  placeholder="">
                </div>

                <div class="form-group">
                    <label class=""  >Telefon</label>
                    <input id="personalcontact_telefon" type="text"  class="form-control"  placeholder="">
                </div>

             
            </div>
             <div class="col-lg-4 col-md-4  col-sm-12  col-xs-12" >
                <div class="form-group">
                    <label >Nachricht <span class="schrift_rot">*</span></label>
                    <!-- <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email"> -->
                    <textarea id="personalcontact_nachricht" class="form-control" rows="17"></textarea>
                </div>
                    <button onclick="sendKontaktRequest()" style="margin-top:30px;"  class="btn btn-block btn-lg actionbutton_green">KONTAKT AUFNEHMEN</button>

            </div>
            <div class="col-lg-4 col-md-4  col-sm-12  col-xs-12 textcol" >
                <div class="top">So erreichen Sie uns:</div>
                <div  class="middle">
                    +49 (0) 6182 955 70 00<br>
                    <a href="mailto:hello@mailtastic.de">hello@mailtastic.de</a>
                </div>
                <div  class="bottom">
                     Dr. Hermann-Neubauer-Ring 32<br>
                    63500 Seligenstadt
                </div>
            </div>
        </div>
    </div>

</div>
</div>

</div>









 <div class="push"></div>
 </div>
	<footer>
             <div class="container">

          <div class="row">
              <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                  <img src="https://www.mailtastic.de/img/footer/logo.png"/>
                  <img class="madeingermany" src="https://www.mailtastic.de/img/footer/MadeInGermany.png"/>
              </div>
               <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                   <div class="footerlink"><a href="/">Start</a></div>
                   <div class="footerlink notfirst"><a href="/look-feel">Produkt</a></div>
                   <div class="footerlink notfirst"><a href="/preise">Preise</a></div>
                   <div class="footerlink notfirst"><a href="/kontakt">Kontakt</a></div>
                   <div class="footerlink notfirst"><a href="/blog">Blog</a></div>
                  
                   
              </div>
               <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                    <div class="footerlink"><a href="/impressum">Impressum</a></div>
                    <div class="footerlink notfirst"><a href="/datenschutz">Datenschutz</a></div>
                    <div class="footerlink notfirst"><a href="/agb">AGB</a></div>
                     <div class="footerlink notfirst"><a href="/jobs">Jobs</a></div>
                         <div class="footerlink notfirst"><a href="/partner">Partner</a></div>
                     
                  
              </div>
               <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                   <div>
                       <a target="_blank" href="https://www.facebook.com/mailtastic">
                   <img class="social" src="https://www.mailtastic.de/img/footer/facebook.png"/>
                   </a>
                    </div>
                     <div>
                         <a target="_blank" href="https://twitter.com/MailtasticApp">
                   <img class="social second"  src="https://www.mailtastic.de/img/footer/twitter.png"/>
                   </a>
                    </div>
              </div>
               <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 footerlink">
                   &copy; NETSTAG GmbH 2015
              </div>
              
              
          </div>
          
          
          
      </div>
         <img onclick="scrollDown()" class="hidden-xs" src="https://www.mailtastic.de/img/common/Pfeil.png" id="scrollpfeil" />
        </footer>
    <!--</div>  /container -->        
         <script src="<?php echo get_stylesheet_directory_uri() ?>/js/vendor/bootstrap.min.js"></script>
          <script src="<?php echo get_stylesheet_directory_uri() ?>/js/vendor/bootstrap-slider.js"></script>
            <script src="https://cdn.jsdelivr.net/bootbox/4.4.0/bootbox.min.js"></script>
          
         <link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_directory_uri() ?>/css/main.css">
<?php
function my_scripts_method() {      //use own version of jquery
    wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js');
    wp_enqueue_script( 'jquery' );
   
}    

add_action('wp_enqueue_scripts', 'my_scripts_method');
?>
         
         
 <script src="<?php echo get_stylesheet_directory_uri() ?>/js/main.js"></script>
 
 
 
 
 
 <script>
// Set to the same value as the web property used on the site
var gaProperty = 'UA-57426207-5';
var disableStr = 'ga-disable-' + gaProperty;
 
// Disable tracking if the opt-out cookie exists.
if (document.cookie.indexOf(disableStr + '=true') > -1) {
  window[disableStr] = true;
}
 
// Opt-out function
function gaOptout() {
  document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
  window[disableStr] = true;
  alert("Analytics Tracking per Cookie deaktiviert.");
}
</script>

 
 <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-57426207-5', 'auto', {'allowLinker': true});
  ga('require', 'linker');
  ga('set', 'anonymizeIp', true);
  ga('linker:autoLink', ['app.mailtastic.de'] );
  ga('send', 'pageview');

</script>


 
 

        <?php wp_footer();?>
    </body>
</html>
