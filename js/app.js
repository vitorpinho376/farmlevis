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
  const newsbaractive = document.getElementById('news-bar-active');

  function ShowNewsletterBar() {
    newsbaractive.classList.remove('hidden');
 }

 function hideBar() {
  newsbar.classList.add('hidden');
 }


   // Show Newsletter Success

   const newsFooter = document.getElementById('newsletter-form');
   const newsFooterSuccess = document.getElementById('newsletter-form-success');
 
  function newsletterSuccess() {
    newsFooter.classList.add('hidden');
    newsFooterSuccess.classList.remove('hidden');
 }