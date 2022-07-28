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
// console.log(dir);
// console.log(filename);
// console.log(theme_type);
// console.log(html);

// let neutral_dark = JSON.parse(fs.readFileSync('neutral_dark.json'));
// let base_preset = JSON.parse(fs.readFileSync('../assets/base-preset.json'));
let base_preset = base_presets.light;
if (theme_type.toUpperCase().includes("DARK")) {
    base_preset = base_presets.dark;
}
// let color_mapping = JSON.parse(fs.readFileSync('../assets/color_mapping.json'));

const dom_options = {
    resources: 'usable',
    url: dir
};

const dom = new JSDOM(html, dom_options);

let image = dom.window.document.getElementById('wallpaper');
// console.log(image);

global.document = dom.window.document;
const color = sourceColorFromImage(image);
// console.log(color);
color.then(function(result) {
    // console.log(result.toString(16)) // "Some User token
    // console.log(theme_type);
    // Get the theme from a hex color
    const theme = themeFromSourceColor(result);
    let scheme = theme.schemes.light.props;
    if (theme_type.toUpperCase().includes("DARK")) {
        scheme = theme.schemes.dark.props;
    }
    for (const key in scheme) {
        // scheme[key] = blendedArrToHex(
        //     tint_color(hexToArr(neutral_dark[key].substring(1)),
        //     hexToArr(scheme[key].toString(16))));
        // console.log(key);
        // console.log(neutral_dark[key]);
        // console.log(customColor(
        //     scheme[key], argbFromHex(neutral_dark[key]
        //         )).color.toString(16));
        scheme[key] = '#' + scheme[key].toString(16).substring(2);
    }

    // console.log(theme);
    // console.log(theme.schemes.dark.props['background'])
    // console.log(customColor(theme.schemes.dark.props['background'], argbFromHex('#1C1B1F')));


    // Print out the theme as JSON
    const theme_name = 'materialu-' + path.basename(filename, path.extname(filename)) + '-' + theme_type;
    let preset = schemeToPreset(scheme, base_preset, color_mapping);
    preset.name = theme_name;
    let preset_json = JSON.stringify(preset, null, 2);
    // console.log(scheme);

    fs.writeFile(path.dirname(abs_image_path) + '/' + theme_name + '.json', preset_json, (err) => {
        if (err) {
            throw err;
        }
        // console.log("JSON data is saved.");
    });
});

// console.log("TEST BLEND!!!!!!!!!");

function schemeToPreset(scheme, base_preset, color_mapping) {
    for (const key in color_mapping) {
        base_preset.variables[key] = scheme[color_mapping[key]];
    }
    return base_preset;
}

function blendColors() {
    var args = [].prototype.slice.call(arguments);
    var base = [0, 0, 0, 0];
    var mix;
    var added;
    while (added = args.shift()) {
        if (typeof added[3] === 'undefined') {
            added[3] = 1;
        }
        // check if both alpha channels exist.
        if (base[3] && added[3]) {
            mix = [0, 0, 0, 0];
            // alpha
            mix[3] = 1 - (1 - added[3]) * (1 - base[3]);
            // red
            mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3]));
            // green
            mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3]));
            // blue
            mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3]));

        } else if (added) {
            mix = added;
        } else {
            mix = base;
        }
        base = mix;
    }

    return mix;
}

// should output [85, 170, 0, 0.75]
function hexToArr(hex) {
    let hex_arr = hex.match(/.{1,2}/g) || [];
    let dec_arr = [];
    for (const i in hex_arr) {
        dec_arr.push(parseInt(hex_arr[i], 16));
    }
    if (dec_arr.length != 4) {
        dec_arr.push(1);
    } else if (dec_arr.length == 4) {
        dec_arr[3] = dec_arr[3] / 255;
    }
    return dec_arr;
}

function blendedArrToHex(arr) {
    let ret_str = "#";
    for (const i in arr) {
        if (i != 3) {
            ret_str += arr[i].toString(16);
        }
    }
    return ret_str;
}
// console.log(blendColors(
//     [ 28, 27, 31, 255 ],
//     [ 255, 28, 27, 31 ]
// ));
// var base = hexToArr("1C1B1F");
// var added = hexToArr("FF1C1B1F");
function tint_color(base, added) {
    // Fast and easy way to combine (additive mode) two RGBA colors with JavaScript.
    // [red, green, blue, alpha] based on these maximul values [255, 255, 255, 1].

    var mix = [];
    mix[3] = 1 - (1 - added[3]) * (1 - base[3]); // alpha
    mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
    mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
    mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue

    return mix;
}

// // Will return [63, 59, 98, 1]
// console.log(tint_color(base, added));
// console.log(blendedArrToHex(tint_color(base, added)));