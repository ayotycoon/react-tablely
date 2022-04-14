export default (element: HTMLDivElement, parentElement: HTMLDivElement)  => {
    const rect = element.getBoundingClientRect();
  
    const offset = parentElement.getBoundingClientRect().top;
  
    const res = [(rect.top - offset) >= 0, (rect.bottom - offset) <= parentElement.clientHeight];
    return res
  
}