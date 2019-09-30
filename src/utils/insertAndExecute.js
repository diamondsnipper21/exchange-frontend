/**
 * Insersts script content into the DOM element by its id
 * @param {String} id element id selector
 * @param {String} text text to insert inside target element
 */
export default function insertAndExecute(id, text) {
  document.getElementById(id).innerHTML = text;
  const scripts = Array.prototype.slice.call(document.getElementById(id).getElementsByTagName('script'));
  for (let i = 0; i < scripts.length; i += 1) {
    if (scripts[i].src !== '') {
      const tag = document.createElement('script');
      tag.src = scripts[i].src;
      document.getElementsByTagName('head')[0].appendChild(tag);
    } else {
      eval(scripts[i].innerHTML);
    }
  }
}
