export function folderNode(tree) {
    let items = []
    let folderItem = null
    for (let i = 0; i < tree.children.length; i++) {
        const node = tree.children[i]

        switch (node.nodeName.toLowerCase()) {
            case 'h5':
                folderItem = {
                    title: node.firstChild?.textContent,
                    items: [],
                }
                break
            case 'div':
                folderItem.items.push(folderNode(node))
                items.push(folderItem)
                folderItem = null
                break
            case 'a':
                if (!folderItem) {
                    items.push({
                        title: node.firstChild?.textContent,
                        type: 'bookmark',
                        url: node.getAttribute('href'),
                        icon: node.getAttribute('icon'),
                    })
                } else {
                    folderItem.items.push({
                        title: node.firstChild?.textContent,
                        type: 'bookmark',
                        url: node.getAttribute('href'),
                        icon: node.getAttribute('icon'),
                    })
                }

                break
        }
    }

    return items
}

export function bookmarkParser(bookmark_file) {
    return bookmark_file
        .replace(/<!DOCTYPE[^>]+>/gi, '')
        .replace(/<!--[^>]+>/gi, '')
        .replace(/<META[^>]+>/gi, '')
        .replace(/<TITLE>[^>]+>/gi, '')
        .replace(/<H1>[^>]+>/gi, '')
        .replace(/<DL><p>/gi, '<div class="folder">')
        .replace(/<DT>[^>]+>(.+)<\/H3>/gi, '<h5>$1</h5>')
        .replace(/<DT><A([^>]+)>(.+)<\/A>/gi, '<a$1>$2</a>')
        .replace(/<\/DL><p>/gi, '</div>')
}

export function domParser(html) {
    if (!window.DOMParser) {
        console.error("Don't support DOMParser API")
        return
    }
    return new DOMParser().parseFromString(html, 'text/html')
}
