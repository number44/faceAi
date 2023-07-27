function detectClickOutside(element: HTMLElement, callback: () => void) {
  const handleClick = (event: MouseEvent) => {
    if (!element.contains(event.target as Node)) {
      callback();
    }
  };
  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}

export default { detectClickOutside };
