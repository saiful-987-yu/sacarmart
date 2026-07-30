document.addEventListener('DOMContentLoaded', () => {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  // মাউসের অবস্থান ট্র্যাক করা
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // ছোট ডটটি সাথে সাথে মুভ করবে
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // বাইরের রিংটি স্মুথলি পেছনে ফলো করার জন্য অ্যানিমেশন লুপ
  function animate() {
    // Smooth follow logic (Lerp)
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animate);
  }
  animate();

  // কোনো বাটন বা লিংকের ওপর মাউস নিলে কার্সার জুম/বড় হবে
  const hoverables = document.querySelectorAll('a, button, input, textarea, .hover-effect');
  
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-hover');
    });
  });
});
