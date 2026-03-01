// Paste this in browser console while a search cell is being edited:
const cell = document.querySelector('.ag-cell-inline-editing');
const cr = cell?.getBoundingClientRect();
const br = document.body.getBoundingClientRect();
console.log('cell:', JSON.stringify({top: cr?.top, bottom: cr?.bottom, left: cr?.left, right: cr?.right}));
console.log('body:', JSON.stringify({top: br?.top, left: br?.left}));
console.log('innerHeight:', window.innerHeight);
const styles = window.getComputedStyle(document.body);
console.log('body transform:', styles.transform);
console.log('body position:', styles.position);
// Also check for transforms on ancestors
let el = cell; let transforms = [];
while (el && el !== document.documentElement) {
  const t = window.getComputedStyle(el).transform;
  if (t && t !== 'none') transforms.push({tag: el.tagName, class: el.className?.substring?.(0, 50), transform: t});
  el = el.parentElement;
}
console.log('ancestor transforms:', JSON.stringify(transforms));
