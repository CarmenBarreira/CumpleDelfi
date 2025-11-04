
  const btn = document.getElementById('btn-wa');

  const phone = '59894857166'; 

  const message = 'Hola, confirmo la asistencia al cumple 🎉';

  btn.addEventListener('click', () => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); 
  });

