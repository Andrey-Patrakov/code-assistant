import * as vscode from 'vscode';
import * as utils from './utils';
import { type StringDifference } from './utils';


export default class Prediction {

    public RATIO_THRESHOLD = 0.6;
    public MAX_DIFF_COUNT = 2;

    private _position: vscode.Position;
    private _text: string;

    constructor(position: vscode.Position, text: string) {
        this._position = position;
        this._text = text.trim();
    }

    get position() {
        return this._position;
    }

    insertLine() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this._text) {
            return;
        }

        editor.edit(editBuilder => {
            const range = editor.document.lineAt(this._position.line).range;
            editBuilder.replace(range, this.getMerged());
        });
    }

    insertWord() {  // TODO
    }

    getDifference(): StringDifference[] {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this._position) {
            return <StringDifference[]>[];
        }

        const editorLine = editor.document.lineAt(this._position.line);
        const diff = utils.stringDifferenceWithTh(editorLine.text, this._text, this.RATIO_THRESHOLD);
        if (diff.ratio >= this.RATIO_THRESHOLD && diff.difference.length <= this.MAX_DIFF_COUNT) {
            return diff.difference;
        }

        return <StringDifference[]>[{
            index: this._position.character+1,
            text: this._text
        }];
    }

    getMerged() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this._position) {
            return '';
        }
        const editorLine = editor.document.lineAt(this._position.line);
        return utils.insertDifference(editorLine.text, this.getDifference());
    }
}
