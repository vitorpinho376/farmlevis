  //Sticked Menu

  const stickedMenu = document.querySelector('div.sticked-menu');

  function showMenu(){
    stickedMenu.classList.remove('dropout');
    stickedMenu.classList.add('visibleMenu');
  }  
  
  function hideMenu(){
    stickedMenu.classList.add('dropout');
  }  


    //News Menu Show

   const newsbar = document.getElementById('news-bar');
   const mapBar = document.getElementById('location-bar');
   const newsbaractive = document.getElementById('news-bar-active');

    function hideBar(sect) {
      sect.classList.add('hidden');
    }

    function showBar(sect) {
      sect.classList.remove('hidden');
    }

   // Show Newsletter Success

   const newsFooter = document.getElementById('newsletter-form');
   const newsFooterSuccess = document.getElementById('newsletter-form-success');
 
  function newsletterSuccess() {
    newsFooter.classList.add('hidden');
    newsFooterSuccess.classList.remove('hidden');
 }

    // Show Map Bar Nav

    const countryNav =  document.getElementById('country-nav');
    const countryNavAlt =  document.getElementById('country-nav-02');

    function navCountries(country, countryAlt) {
      country.classList.add('hidden');
      countryAlt.classList.remove('hidden');
    }