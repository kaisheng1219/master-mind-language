let editor;
let tokenTable;
let tb1; 
let tab2;
let correctPanel;

const filePickerOpts = {
    types: [
        {
            description: "Text file",
            accept: {
                "text/plain": [".txt"],
            },
        },
    ]
}

function initEditor() {
    editor = ace.edit("input");
    editor.setTheme("ace/theme/github_dark");
    editor.setOptions({
        highlightActiveLine: false,
        fontSize: '1rem',
        fixedWidthGutter: false
    });
}

function initTabs() {
    const tabs = document.querySelectorAll('[data-tab-target]');
    const activeClass = 'bg-indigo-200';

    tabs[0].classList.add(activeClass);
    document.querySelector('#tab1').classList.remove('hidden');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetContent = document.querySelector(tab.dataset.tabTarget);
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            targetContent.classList.remove('hidden');
            document.querySelectorAll('.bg-indigo-200').forEach(activeTab => activeTab.classList.remove(activeClass));
            tab.classList.add(activeClass);
        });
    });
}

function populateTokenTable(tbody, tokens) {
    for (let i = 0; i < tokens.length; i++) {
        const tr = tbody.insertRow();
        tr.classList.add('border-b');
        tr.classList.add(tokens[i].type === TOKEN_TYPE.INVALID ? 'bg-red-200' : 'bg-white');
        tr.innerHTML += 
        `
            <td class="whitespace-nowrap px-4 py-2 font-medium">${i+1}</td>
            <td class="whitespace-nowrap px-4 py-2">${tokens[i].spelling}</td>
            <td class="whitespace-nowrap px-4 py-2">${tokens[i].type}</td>
        `;
    }
}

function parse() {
    const scanner = new Scanner();
    const tokens = scanner.scan();

    if (tokens.length > 0) {
        tokenTable.classList.remove('hidden');
        tb1.innerHTML = "";
        populateTokenTable(tb1, tokens);
        const parser = new Parser(tokens);

        try {
            parser.parse();    
            if (parser.isValidSyntax) {
                correctPanel.classList.remove('hidden');
            }
        } catch (ex) {
            const errorPanel = document.getElementById('errorBox');
            errorPanel.classList.remove('hidden');
            const errorText = document.getElementById('errorText');
            errorText.innerHTML = parser.errorText;
        }
    } else {
        tokenTable = document.getElementById('token-table');
        tb1 = document.getElementById('tab1-body');
        tokenTable.classList.add('hidden');
        tb1.innerHTML = "";

        const errorPanel = document.getElementById('errorBox');
        errorPanel.classList.add('hidden');
        correctPanel.classList.add('hidden');
    }
}

async function loadFile() {
    let [fileHandler] = await window.showOpenFilePicker(filePickerOpts);
    const fileData = await fileHandler.getFile();
    const text = await fileData.text();
    editor.setValue(text);
    editor.clearSelection();
}

async function saveFile(sourceId) {
    try {
        const fileHandler = await window.showSaveFilePicker(filePickerOpts);
        const stream = await fileHandler.createWritable();
        
        if (sourceId === 'input') {
            await stream.write(editor.getValue());
        }
        else {
            const source = document.getElementById(sourceId);
            await stream.write(source.innerHTML);
        }
        await stream.close();
    } catch (ex) {
        console.log(ex);
    }
}

function clearEditor() {
    editor.setValue("", 0);
}

document.addEventListener("DOMContentLoaded", () => {
    initEditor();
    initTabs();

    tokenTable = document.getElementById('token-table');
    tb1 = document.getElementById('tab1-body');
    tab2 = document.getElementById('tab2');
    correctPanel = document.getElementById('corrBox');
});