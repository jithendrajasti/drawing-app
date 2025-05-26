const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const eraserBtn = document.getElementById('eraserBtn');

    let drawing = false;
    let isErasing = false;

    function toggleEraser() {
      isErasing = !isErasing;
      eraserBtn.textContent = isErasing ? '✏️ Brush' : '🧽 Erase';
      eraserBtn.style.backgroundColor = isErasing ? '#d32f2f' : '#333';
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;

      ctx.lineWidth = brushSize.value;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isErasing ? '#ffffff' : colorPicker.value;

      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });

    function getTouchPos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.touches[0].clientX - rect.left),
        y: (e.touches[0].clientY - rect.top)
      };
    }

    function startTouch(e) {
      e.preventDefault();
      drawing = true;
      const pos = getTouchPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function moveTouch(e) {
      if (!drawing) return;
      e.preventDefault();
      const pos = getTouchPos(e);

      ctx.lineWidth = brushSize.value;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isErasing ? '#ffffff' : colorPicker.value;

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function endTouch() {
      drawing = false;
    }

    canvas.addEventListener('touchstart', startTouch, { passive: false });
    canvas.addEventListener('touchmove', moveTouch, { passive: false });
    canvas.addEventListener('touchend', endTouch);

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function downloadImage() {
      const link = document.createElement('a');
      link.download = 'my_drawing.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
   
    