#!/usr/bin/env node

import { themeFromSourceColor, sourceColorFromImage } from "@material/material-color-utilities";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yargs = require("yargs");
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('node:path');
const resolve = require('path').resolve
const base_presets = require('../assets/base_presets.json');
const color_mapping = require('../assets/color_mapping.json');

const options = yargs
    .usage("Usage: -i <image path> -t <theme type>")
    .option("i", { alias: "image_path", describe: "Path to image file", type: "string", demandOption: true })
    .option("t", { alias: "type", describe: "Specify theme type (dark|light)", type: "string", demandOption: true })
    .argv;

const abs_image_path = resolve(options.image_path);
const dir = 'file:///' + path.dirname(abs_image_path) + '/';
const filename = path.basename(abs_image_path);
const theme_type = options.type;
const html = '<!DOCTYPE html><img id="wallpaper" src="' + filename + '"/>';

let base_preset = base_presets.light;
if (theme_type.toUpperCase().includes("DARK")) {
    base_preset = base_presets.dark;
}

const dom_options = {
    resources: 'usable',
    url: dir
};

const dom = new JSDOM(html, dom_options);

let image = dom.window.document.getElementById('wallpaper');

global.document = dom.window.document;
const color = sourceColorFromImage(image);

color.then(function(result) {
    // Get the theme from a hex color
    const theme = themeFromSourceColor(result);
    let scheme = theme.schemes.light.props;
    if (theme_type.toUpperCase().includes("DARK")) {
        scheme = theme.schemes.dark.props;
    }
    for (const key in scheme) {
        scheme[key] = '#' + scheme[key].toString(16).substring(2);
    }

    // Print out the theme as JSON
    const theme_name = 'materialu-' + path.basename(filename, path.extname(filename)) + '-' + theme_type;
    let preset = schemeToPreset(scheme, base_preset, color_mapping);
    preset.name = theme_name;
    let preset_json = JSON.stringify(preset, null, 2);

    fs.writeFile(path.dirname(abs_image_path) + '/' + theme_name + '.json', preset_json, (err) => {
        if (err) {
            throw err;
        }
    });
});

function schemeToPreset(scheme, base_preset, color_mapping) {
    for (const key in color_mapping) {
        base_preset.variables[key] = scheme[color_mapping[key]];
    }
    return base_preset;
}
