import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextEditorService {
  document!: Document

  constructor() { }

  insertHTML(html: string) {
    const selection = (this.document.defaultView as Window).getSelection() as Selection;
    let range = selection.getRangeAt(0) as Range;

    // IE9 and non-IE
    if (range && selection.rangeCount) {
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      let el = document.createElement("div");
      el.innerHTML = html;
      let frag = document.createDocumentFragment(), node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
}
