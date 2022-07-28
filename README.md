# Adwaita Preset Generator using Material U Color Generation
NOTE: The preset.json file this project creates is only usable with the AdwCustomizer application available here: https://github.com/ArtyIF/AdwCustomizer

## Installation
```
git clone https://github.com/avanishsubbiah/adwaita-materialu.git
cd adwaita-materialu
npm install
npm install -g .
```

## Usage
Run the command below and the preset generated will be written to the folder where the image is located.
```
gen-materialu-theme -i <Path to image file> -t <Theme type (dark|light)>
```
Then move the generated preset.json file to the preset folder for AdwCustomizer. | Default: `$HOME/.var/app/com.github.ArtyIF.AdwCustomizer/config/presets`
