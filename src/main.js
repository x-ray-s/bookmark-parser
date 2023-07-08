import './app.css'

import { JSONEditor } from 'vanilla-jsoneditor'
import { domParser, folderNode, bookmarkParser, json2bookmark } from './parser'

let content = {
    text: undefined,
    json: {},
}

const $editor = document.getElementById('jsoneditor')
const $dom = document.getElementById('dom')

let editor = new JSONEditor({
    target: $editor,
    props: {
        content,
        onChange: (
            updatedContent,
            previousContent,
            { contentErrors, patchResult }
        ) => {
            // content is an object { json: JSONData } | { text: string }
            console.log('onChange', {
                updatedContent,
                previousContent,
                contentErrors,
                patchResult,
            })
            content = updatedContent
            document.querySelector('#dom').innerHTML = json2bookmark(
                updatedContent.json
            )
        },
    },
})

let fileHandle
let data
let html
document.getElementById('import').addEventListener('click', async () => {
    ;[fileHandle] = await window
        .showOpenFilePicker({
            startIn: fileHandle,
            types: [
                {
                    accept: {
                        'text/html': ['.html'],
                    },
                },
            ],
        })
        .catch((e) => {})
    const file = await fileHandle.getFile()
    const contents = await file.text()

    const dom = domParser(bookmarkParser(contents))
    const fold = dom.body.querySelector('.folder')
    html = fold.innerHTML
    document.querySelector('#dom').innerHTML = html
    data = folderNode(fold)

    editor.set({
        text: undefined,
        json: data,
    })
    document.getElementById('step-2').classList.remove('hidden')
})

document.getElementById('review').addEventListener('click', async () => {
    const { json } = editor.get()
    document.querySelector('#dom').innerHTML = json2bookmark(json)
    $dom.classList.toggle('hidden')
    await import('./index.js')
})

document.getElementById('download-json').addEventListener('click', async () => {
    const options = {
        suggestedName: 'bookmark.json',
        types: [
            {
                description: 'JSON File',
                accept: {
                    'application/json': ['.json'],
                },
            },
        ],
    }
    const handle = await window.showSaveFilePicker(options)
    const writable = await handle.createWritable()
    // Write the contents of the file to the stream.
    const { json } = editor.get()
    await writable.write({
        type: 'write',
        position: 0,
        data: JSON.stringify(json[0]),
    })
    // Close the file and write the contents to disk.
    await writable.close()
})

document.getElementById('download-html').addEventListener('click', async () => {
    const options = {
        suggestedName: 'bookmark-export.html',
        types: [
            {
                description: 'HTML File',
                accept: {
                    'text/html': ['.html'],
                },
            },
        ],
    }
    const handle = await window.showSaveFilePicker(options)
    const writable = await handle.createWritable()
    const style = await fetch(
        document.getElementById('style').getAttribute('href')
    ).then((r) => r.text())
    // Write the contents of the file to the stream.
    const template = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>${style}</style>
        <style>.container {max-width: 960px; margin: 0 auto;}</style>
    </head>
    <body>
    <div id="dom" class="container theme-2">${
        document.querySelector('#dom').innerHTML
    }</div>
        <script>
        const $title = document.querySelectorAll('.folder > h5')

        Object.values($title).forEach((item) => {
            item.addEventListener('click', (e) => {
                item.parentNode.classList.toggle('open')
            })
        })

        </script>
    </body>
    </html>`
    await writable.write({
        type: 'write',
        position: 0,
        data: template,
    })
    // Close the file and write the contents to disk.
    await writable.close()
})
