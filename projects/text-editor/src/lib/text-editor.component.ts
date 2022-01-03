import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faFont, faHighlighter, faLink, faListOl, faListUl, faRedo, faSubscript, faSuperscript, faUndo, faUnlink } from "@fortawesome/free-solid-svg-icons";
import { TextEditorService } from './text-editor.service';

@Component({
    selector: 'bin-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

    @Input() value = "";
    @Input() readonly = false;
    @Output() changed = new EventEmitter<{ text: string, html: string }>();

    faUndo = faUndo;
    faRedo = faRedo;
    faListOl = faListOl;
    faListUL = faListUl;
    faFont = faFont;
    faHighlighter = faHighlighter;
    faAlignJustify = faAlignJustify;
    faAlignCenter = faAlignCenter;
    faAlignLeft = faAlignLeft;
    faAlignRight = faAlignRight;
    faLink = faLink;
    faUnlink = faUnlink;
    faSubscript = faSubscript;
    faSuperscript = faSuperscript;
    showColorPicker = false;
    showHilitePicker = false;

    element!: HTMLElement;
    frame!: HTMLIFrameElement;
    document!: Document;
    body!: HTMLBodyElement;
    observer!: MutationObserver;

    toggleColorPicker(event: MouseEvent) {
        const target = event.target as HTMLElement;
        this.showColorPicker = target.id != 'color-picker';
    }

    toggleHilitePicker(event: MouseEvent) {
        const target = event.target as HTMLElement;
        this.showHilitePicker = target.id != 'color-picker';
    }

    constructor(
        private el: ElementRef,
        private textEditorService: TextEditorService
    ) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.element = this.el.nativeElement;
        this.frame = this.element.querySelector('#canvas') as HTMLIFrameElement;
        this.document = this.frame.contentDocument as Document;
        this.body = this.document.body as HTMLBodyElement;
        this.body.innerHTML = this.value;

        if (!this.readonly) {
            this.document.designMode = 'on';
            this.document.execCommand('enableInlineTableEditing');
            this.document.execCommand('enableObjectResizing');
            this.document.execCommand('enableAbsolutePositionEditor');
        }

        this.checkChanges();
        this.textEditorService.document = this.document;
    }

    ngOnDestroy() {
        this.observer.disconnect();
    }

    checkChanges() {
        const config = {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        };

        this.observer = new MutationObserver(() => {
            const data = { text: this.body.textContent as string, html: this.body.innerHTML };
            this.changed.emit(data);
        });

        this.observer.observe(this.document.documentElement, config);
    }

    getSelectedText() {
        const selected = window.getSelection();
        return selected === null || selected === void 0 ? void 0 : selected.toString();
    }

    undo() {
        this.document.execCommand('undo', true);
    }

    redo() {
        this.document.execCommand('redo', true);
    }

    fontName(value: string) {
        this.document.execCommand('fontname', false, value);
    }

    fontSize(value: string) {
        this.document.execCommand('fontsize', false, value);
    }

    justifyLeft() {
        this.document.execCommand('justifyLeft');
    }

    justifyCenter() {
        this.document.execCommand('justifyCenter');
    }

    justifyFull() {
        this.document.execCommand('justifyFull');
    }

    justifyRight() {
        this.document.execCommand('justifyRight');
    }

    bold() {
        const a = this.document.execCommand('bold');
    }

    italic() {
        this.document.execCommand('italic');
    }

    underline() {
        this.document.execCommand('underline');
    }

    subScript() {
        this.document.execCommand('Subscript');
    }

    superScript() {
        this.document.execCommand('SuperScript');
    }

    strikeThrough() {
        this.document.execCommand('StrikeThrough');
    }

    orderedList() {
        this.document.execCommand('insertorderedlist');
    }

    unOrderedList() {
        this.document.execCommand('insertunorderedlist');
    }

    foreColor(value: string) {
        this.document.execCommand('ForeColor', false, value);
    }

    hilitecolor(value: string) {
        this.document.execCommand('hilitecolor', false, value);
    }

    backgroundColor(value: string) {
        this.body.style.backgroundColor = value;
    }

    link() {
        const url = prompt('Enter the Url') as string;
        this.document.execCommand('createlink', false, url);
    }

    unlink() {
        this.document.execCommand('unlink');
    }

    insertTable(table: HTMLTableElement) {
        const t = table.cloneNode(true) as HTMLTableElement;
        t.style.display = 'table';

        this.textEditorService.insertHTML(t.outerHTML);
    }
}
