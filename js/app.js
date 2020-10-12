  //Sticked Menu

  const stickedMenu = document.querySelector('div.sticked-menu');

  function showMenu(){
    stickedMenu.classList.remove('dropout');
    stickedMenu.classList.add('visibleMenu');
  }  
  
  function hideMenu(){
    stickedMenu.classList.add('dropout');
  }  
