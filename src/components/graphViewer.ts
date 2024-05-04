import * as vscode from 'vscode';

export const GraphViewer = (src: vscode.Uri) => {
    console.log(src);

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Spear Graph</title>
      </head>
      <body>
      <object style="width:100%; height: auto; aspect-ratio: 21/29" data="${src}">
      </object>
      </body>
      </html>`;
}