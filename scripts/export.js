// exportFigmaElements.js

// Загружаем переменные окружения из файла .env
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
const OUTPUT_DIR = path.join(__dirname, '../assets/img');
const BASE_ASSET_URL = './assets/img';

const exportsConfig = [
    { name: 'buttons',   suffix: '_btn', nameTemplate: '[parent]_btn_[node]' },
    { name: 'checkboxes', suffix: '_switch', nameTemplate: '[parent]_checkbox_[node]' },
    { name: 'progress',   suffix: '_progress', nameTemplate: '[parent]_progress_[node]' },
];

async function getFigmaFile(fileKey) {
    const url = `https://api.figma.com/v1/files/${fileKey}`;
    const response = await fetch(url, {
        headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });
    if (!response.ok) {
        throw new Error(`Ошибка получения файла: ${response.statusText}`);
    }
    return await response.json();
}

async function getImageUrls(fileKey, nodeIds) {
    const ids = nodeIds.join(',');
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${ids}&format=png`;
    const response = await fetch(url, {
        headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });
    if (!response.ok) {
        throw new Error(`Ошибка получения URL изображений: ${response.statusText}`);
    }
    const data = await response.json();
    return data.images;
}

async function downloadImage(url, outputPath) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка скачивания изображения с ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(outputPath, buffer);
}

async function processNode( {nodeName, node, exportPath, name, config }, fileKey, outputDir) {
    const nodeIds = [node.id];
    const fileName = `${nodeName}.png`;
    const output = path.join(outputDir, exportPath);
    const outputPath = path.join(output, fileName);

    if (!fs.existsSync(outputPath)) {
        const imageUrls = await getImageUrls(fileKey, nodeIds);
        const imageUrl = imageUrls[node.id];

        if (!fs.existsSync(output) && exportPath !== '') {
            await fs.promises.mkdir(output, { recursive: true });
        }

        await downloadImage(imageUrl, outputPath);
    }

    return { alias: name, src: `${BASE_ASSET_URL}/${exportPath}/${fileName}` };
}

async function main() {
    try {
        const figmaData = await getFigmaFile(FILE_KEY);
        const document = figmaData.document;
        const firstPage = document.children[0];
        const collectedNodes = collectFolderNode(firstPage, '');
        const metaEntries = [];

        for (let i = 0; i < collectedNodes.length; i++) {
            const meta = await processNode(collectedNodes[i], FILE_KEY, OUTPUT_DIR);
            metaEntries.push(meta);
        }

        const formattedJSON = JSON.stringify(metaEntries, null, 0)
            .replace(/\},\{/g, '},\n    {') // Разделяем объекты с новой строкой
            .replace(/\[\{/g, '[\n    {')   // Добавляем новую строку после [
            .replace(/\}\]/g, '}\n]');

        const metaFilePath = path.join(OUTPUT_DIR, 'meta.json');
        await fs.promises.writeFile(metaFilePath, formattedJSON);
        console.log(`\nМетафайл сохранён по пути: ${metaFilePath}`);
        console.log('\nЭкспорт завершён!');
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

 function collectFolderNode(node, currentExportPath = '') {
    let collected = [];

    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            if (child.name.startsWith('path/')) {
                const newPath = child.name.substring('path/'.length).trim();
                collected = collected.concat(collectFolderNode(child, path.join(currentExportPath, newPath)));
            } else{
                collected = collected.concat(collectElementsNode(child, currentExportPath));
            }
        }
    }

    return collected;
}

 function collectElementsNode(node, exportPath) {
    let collected = []

    for (const config of exportsConfig) {
        if (node.name.endsWith(config.suffix)) {
            const name = node.name.replace(config.suffix, '');
            collected = collected.concat(collectAllSubNodes(node, config, name, path.join(exportPath, name)));
            break;
        }
    }

    if (collected.length === 0) {
        if (node.type === 'COMPONENT_SET') {
                collected = collected.concat(collectComponentVariants(node, node.name, path.join(exportPath, node.name)));
        } else {
                collected.push({node, exportPath, name: node.name, nodeName: node.name});
        }
    }

    return collected;
}

 function collectAllSubNodes(node, config, parentName, currentExportPath = '') {
    let collected = [];

    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            const name = config.nameTemplate.replace('[parent]', parentName).replace('[node]', child.name);
            collected.push({ node: child, exportPath: currentExportPath, name, config, nodeName: child.name });
        }
    }

    return collected;
}

function collectComponentVariants(node, parentName, currentExportPath = '') {
    let collected = [];

    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            const nodeName = child.name.replace('type=', '');
            const name = `${parentName}_${nodeName}`;
            collected.push({ node: child, exportPath: currentExportPath, name, nodeName });
        }
    }

    return collected;
}

main();
