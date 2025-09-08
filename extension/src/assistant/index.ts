import * as vscode from 'vscode';
import Prediction from './prediction';
import Decoration from './decoration';
import axios from 'axios';


export default class Assistant {
    private _prediction: Prediction | null;
    private _decoration: Decoration;

    constructor() {
        let decoration_text = 'Обновить предсказание: `Alt` + `U`'
        decoration_text += 'Вставка строки: `Alt` + `→`\\\n';
        decoration_text += 'Вставка слова: `Alt` + `←`\\\n';

        this._prediction = null;
        this._decoration = new Decoration(decoration_text);
    }

    insertLine() {
        this._prediction?.insertLine();
        this.clear();
    }

    insertWord() {
        this._prediction?.insertWord();
        this.clear();
    }

    async update() {
        await this.predict();
        if (this._prediction) {
            this._decoration.show(this._prediction);
        }
    }

    clear() {
        this._prediction = null;
        this._decoration.clear();
    }

    async predict() {
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
        });
    }
}