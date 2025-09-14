import * as vscode from 'vscode';
import Prediction from './prediction';
import Decoration from './decoration';
import axios from 'axios';


export default class Assistant {
    private _prediction: Prediction | null;
    private _decoration: Decoration;
    private _loading: boolean;
    private _ignorePredict: boolean;

    constructor() {
        let decoration_text = 'Обновить предсказание: `Alt` + `U`'
        decoration_text += 'Вставка строки: `Alt` + `→`\\\n';
        decoration_text += 'Отмена (убрать подсказку): `Alt` + `←`\\\n';

        this._loading = false;
        this._ignorePredict = false;
        this._prediction = null;
        this._decoration = new Decoration(decoration_text);
    }

    insertLine() {
        this._ignorePredict = true;
        this._prediction?.insertLine();
        this.clear();
    }

    insertWord() {
        this._ignorePredict = true;
        this._prediction?.insertWord();
        this.clear();
    }

    async update() {
        if (!this._loading)
        {
            this._loading = true;
            try {
                await this.predict();
            } finally {
                this._loading = false;
            }
        }

        if (!this._prediction) {
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        if (editor.selection.active.line == this._prediction.position.line) {
            this._decoration.show(this._prediction);
        }
    }

    clear() {
        this._prediction = null;
        this._decoration.clear();
        vscode.commands.executeCommand('setContext', 'code-assistant.hasPrediction', false);
    }

    async predict() {
        if (this._ignorePredict) {
            this._ignorePredict = false;
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const text = editor.document.getText();
        const cursorPos = editor.selection.active;
        const cursorOffset = editor.document.offsetAt(cursorPos) + 1;

        if (!text) {
            return
        }

        await axios.post('http://localhost:3000/complete', {
            text: text,
            position: cursorOffset,
            api_key: 'rando_string'
        }).then(response => {
            this._prediction = new Prediction(cursorPos, response.data);
            vscode.commands.executeCommand('setContext', 'code-assistant.hasPrediction', true);
        });
    }
}