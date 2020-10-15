  //Sticked Menu

  var stickedMenu = document.querySelector('div.sticked-menu');
  var cartButton = document.querySelector('.cart-button');

  function showMenu(){
    try {
      stickedMenu.classList.remove('dropout');
      stickedMenu.classList.add('visibleMenu');
      cartButton.classList.add('is-hidden');
    } catch (error) {
      console.error('showMenu -> error', error);
      stickedMenu.classList.remove('dropout');
      stickedMenu.classList.add('visibleMenu');
    }
  }
  
  function hideMenu(){
    try {
      stickedMenu.classList.add('dropout');
      cartButton.classList.remove('is-hidden');
    } catch (error) {
      console.error('hideMenu -> error', error);
      stickedMenu.classList.add('dropout');
    }
  }


    //News Menu Show

   var newsbar = document.getElementById('news-bar');
   var mapBar = document.getElementById('location-bar');
   var newsbaractive = document.getElementById('news-bar-active');

    function hideBar(sect) {
      sect.classList.add('hidden');
    }

    function showBar(sect) {
      sect.classList.remove('hidden');
    }

   // Show Newsletter Success

   var newsFooter = document.getElementById('newsletter-form');
   var newsFooterSuccess = document.getElementById('newsletter-form-success');
 
  function newsletterSuccess() {
    newsFooter.classList.add('hidden');
    newsFooterSuccess.classList.remove('hidden');
 }

    // Show Map Bar Nav

    var countryNav =  document.getElementById('country-nav');
    var countryNavAlt =  document.getElementById('country-nav-02');

    function navCountries(country, countryAlt) {
      country.classList.add('hidden');
      countryAlt.classList.remove('hidden');
    }
