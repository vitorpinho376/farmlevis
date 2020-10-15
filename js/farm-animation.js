
// Farm Canvas Animation

  const html = document.documentElement;
  const canvas = document.getElementById("farm-photos");
  const context = canvas.getContext("2d");
  
  const frameCount = 200;
  const currentFrame = index => (
    `/frames/${index.toString().padStart(4, '0')}.jpg`
  )
  
  const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);

    }
  };
  
  const img = new Image()
  img.src = currentFrame(1);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  img.onload=function(){
    context.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
  }
  
  const updateImage = index => {
    img.src = currentFrame(index);
    context.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
  }
  
  window.addEventListener('scroll', () => {  
    const scrollTop = html.scrollTop - window.innerHeight;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
      frameCount - 1,
      Math.ceil(scrollFraction * frameCount)
    );
    
    requestAnimationFrame(() => updateImage(frameIndex + 1))
  });
  
  preloadImages()

