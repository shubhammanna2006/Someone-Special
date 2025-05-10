let highestZ = 1;

class Paper {
  constructor() {
    this.holding = false;
    this.rotating = false;
    this.startX = 0;
    this.startY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = Math.random() * 30 - 15;
  }

  init(paper) {
    paper.style.transform = `translate(0px, 0px) rotate(${this.rotation}deg)`;

    paper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.holding = true;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.prevX = this.startX;
        this.prevY = this.startY;
        paper.style.zIndex = highestZ++;
      } else if (e.touches.length === 2) {
        this.rotating = true;
        this.startAngle = this.getAngle(e.touches);
      }
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (this.holding && e.touches.length === 1) {
        const touch = e.touches[0];
        const dx = touch.clientX - this.prevX;
        const dy = touch.clientY - this.prevY;

        this.currentX += dx;
        this.currentY += dy;

        this.prevX = touch.clientX;
        this.prevY = touch.clientY;

        paper.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
      }

      if (this.rotating && e.touches.length === 2) {
        const angle = this.getAngle(e.touches);
        const delta = angle - this.startAngle;
        this.rotation += delta;
        this.startAngle = angle;

        paper.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
      }
    }, { passive: false });

    paper.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        this.holding = false;
        this.rotating = false;
      }
    });
  }

  getAngle(touches) {
    const [t1, t2] = touches;
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
}

const papers = document.querySelectorAll('.paper');
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
