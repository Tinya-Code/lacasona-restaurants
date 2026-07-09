export class UpdateDom {
  element: HTMLElement;
  
  constructor(element: HTMLElement) {
    this.element = element;
  }
  
  updateClass(className: string | string[]) {
    if (Array.isArray(className)) {
      this.element.classList.add(...className);
    } else {
      this.element.classList.add(className);
    }
  }
  
  removeClass(className: string | string[]) {
    if (Array.isArray(className)) {
      this.element.classList.remove(...className);
    } else {
      this.element.classList.remove(className);
    }
  }
  
  toggleClass(className: string) {
    this.element.classList.toggle(className);
  }
  
  setAttribute(name: string, value: string) {
    this.element.setAttribute(name, value);
  }
  
  removeAttribute(name: string) {
    this.element.removeAttribute(name);
  }
  
  setTextContent(text: string) {
    this.element.textContent = text;
  }
  
  setHtml(html: string) {
    this.element.innerHTML = html;
  }
  
}
