// exportFigmaElements.js

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
const OUTPUT_DIR = path.join(__dirname, '../assets/img');
const BASE_ASSET_URL = './assets/img';

const NODE_TYPE = {
    FRAME: 'FRAME',
    COMPONENT: 'COMPONENT',
    TEXT: 'TEXT',
    BLOCK: 'block',
};

const COMPONENTS = {
    BUTTON: 'button',
    FILL: 'fill',
    CONTAINER: 'fill',
};

function parseComponent(node) {
    const config = {
        name: node.name,
        parameters: {},
        options: {},
    };

    if (node.name === COMPONENTS.FILL) {
        const fill = node.children[0].fills[0];
        config.options = {
            color: `rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.opacity})`,
            width: '100%',
            height: '100%',
        };
    }

    return config;
}

function parseFrame(node) {
    const config = {
        name: node.name,
        children: [],
    };

    for (const child of node.children) {
        if (child.type === NODE_TYPE.COMPONENT) {
            const component = parseComponent(child);
            config.children.push(component);
        } else {
            console.log(child);
        }
    }

    return config;
}

function parseText(node) {
    console.log(node);

    return {
        type: node.name,
        text: node.characters,
    };
}

function parseBlock(node) {
    const config = {
        type: node.name,
        children: [],
        options: {
            verticalAlign: 'top',
            horizontalAlign: 'left',
            gap: 0,
            layoutMode: 'VERTICAL',
            width:
        },
        parameters: {
            constraints: node.constraints
        }
    };

    console.log(node);

    return config;
}

const NODE_PARSER = {
    [NODE_TYPE.FRAME]: parseFrame,
    [NODE_TYPE.BLOCK]: parseBlock,
};

async function main() {
    try {
        const figmaData = await getFigmaFile(FILE_KEY);
        const document = figmaData.document;
        const firstPage = document.children[1];

        for (const child of firstPage.children) {
            const parser = NODE_PARSER[child.type];
            if (parser) {
                parser(child);
            }
        }
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

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


main();
