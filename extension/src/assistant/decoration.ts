import * as vscode from 'vscode';
import * as utils from './utils';
import Prediction from './prediction';


export default class Decoration {

    private _decorations: vscode.TextEditorDecorationType[];
    private _hoverMessage: vscode.MarkdownString;

    constructor(hoverMessage: string = '') {
        this._decorations = [];
        this._hoverMessage = new vscode.MarkdownString(hoverMessage);
    }

    show(prediction: Prediction) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        this.clear();

        const editorText = editor.document.lineAt(prediction.position.line).text;
        const mergedText = prediction.getMerged();
        const predictedList = utils.stringDifference(editorText, mergedText);

        predictedList.forEach((pred: utils.StringDifference) => {
            const decoration = vscode.window.createTextEditorDecorationType({
                after: {
                    contentText: pred.text,
                    color: new vscode.ThemeColor("editorGhostText.foreground"),
                }
            });
            this._decorations.push(decoration);

            const pos = new vscode.Position(prediction.position.line, pred.index);
            editor.setDecorations(decoration, [{
                range: new vscode.Range(pos, pos),
                hoverMessage: this._hoverMessage
            }]);
        })
    }

    clear() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        this._decorations.forEach((decoration) => {
            editor.setDecorations(decoration, []);
        });

         this._decorations = [];
    }
}
