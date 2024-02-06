let editor;
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

function parse() {
    scan();
    topDownParse();
}

async function loadFile() {
    let [fileHandler] = await window.showOpenFilePicker(filePickerOpts);
    let fileData = await fileHandler.getFile();
    let text = await fileData.text();
    editor.setValue(text);
    editor.clearSelection();
}

async function saveFile(sourceId) {
    let [fileHandler] = await window.showSaveFilePicker(filePickerOpts);
    let stream = await fileHandler.createWriteable();
    if (sourceId === '#input')
        await stream.write(ace.getValue());
    else {
        const source = document.getElementById(sourceId);
        await stream.write(source.innerHTML);
    }
    await stream.close();
}

function clearEditor() {
    editor.setValue("", 0);
}

document.addEventListener("DOMContentLoaded", () => {
    initEditor();
    initTabs();
    // var myInput = document.getElementById("input");
    // if(myInput.addEventListener ) {
    //     myInput.addEventListener('keydown',keyHandler,false);
    // } else if(myInput.attachEvent ) {
    //     myInput.attachEvent('onkeydown',keyHandler); /* damn IE hack */
    // }

    // function keyHandler(e) {
    //     var TABKEY = 9;
    //     if(e.keyCode == TABKEY) {
    //         this.value += "    ";
    //         if (e.preventDefault) {
    //             e.preventDefault();
    //         }
    //         return false;
    //     }
    // }
});