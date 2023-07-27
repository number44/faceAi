import throttle from "./throttle";

function detectScroll(foo: Function, wait = 300) {
  const food = () => {
    scrollingFoo(foo);
  };
  document.addEventListener("scroll", throttle(food, wait));
}
const scrollingFoo = (foo: Function) => {
  let lastKnownScrollPosition = 0;
  let ticking = false;

  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function () {
      foo(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }

  const scrollPositionPx = lastKnownScrollPosition;
  return scrollPositionPx;
};

export default detectScroll;
