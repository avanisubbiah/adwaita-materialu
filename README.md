# Adwaita Preset Generator using Material U Color Generation
Material U Color generation is done using the material-color-utilities available here: https://github.com/material-foundation/material-color-utilities

## Requirements
 - **AdwCustomizer** | Needed for applying preset | https://github.com/ArtyIF/AdwCustomizer
 - **NodeJS** | Required to run script

## Installation
You can clone the repo and install or you can directly install from npm
```
npm install -g adwaita-materialu
```
or
```
git clone https://github.com/avanishsubbiah/adwaita-materialu.git
cd adwaita-materialu
npm install
npm install -g .
```
NOTE: running `npm install -g <package>` will cause a permissions issue. To resolve this either run as sudo (**not recommended**) or add the following lines to your .bashrc
```
npm set prefix ~/.npm
PATH="$HOME/.npm/bin:$PATH"
PATH="./node_modules/.bin:$PATH"
```

## Usage
Run the command below and the preset generated will be written to the folder where the image is located
```
gen-materialu-theme -i <Path to image file> -t <Theme type (dark|light)>
```
Then move the generated preset.json file to the preset folder for AdwCustomizer
 - Default Location: `$HOME/.var/app/com.github.ArtyIF.AdwCustomizer/config/presets`

## Examples
![Water Lily Light](https://i.imgur.com/x22C9cu.png)
![Water Lily Dark](https://i.imgur.com/x7z1gdZ.png)
![Nord Light](https://i.imgur.com/Kqhnw5s.png)
![Nord Dark](https://i.imgur.com/m6ojaa4.png)
![Cherry Light](https://i.imgur.com/c4ijgD2.png)
![Cherry Dark](https://i.imgur.com/2T4V5IZ.png)
