import { Injectable, Optional } from '@angular/core';
import { RGBA } from './color-picker.models';


@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
  defaultColors?: string[];
  systemColors?: string[];

  constructor(
    @Optional() config: ColorPickerServiceConfig
  ) {
    if (config) {
      this.defaultColors = config.defaultColors;
      this.systemColors = config.systemColors;
    }
  }

  hexToRGB(hex: string, alpha = true) {
    let r = '0', g = '0', b = '0', a: any = '255';
    if (hex.length == 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    }
    else if (hex.length == 5) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
      a = "0x" + hex[4] + hex[4];
    }
    else if (hex.length == 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }
    else if (hex.length == 9) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
      a = "0x" + hex[7] + hex[8];
    }

    a = +(a / 255).toFixed(3);

    if (alpha == false) {
      return `rgb(${+r}, ${+g}, ${+b})`;
    }
    else {
      return `rgb(${+r}, ${+g}, ${+b}, ${a})`;
    }
  }

  hexToHSL(hex: string, alpha = true) {
    let color = this.hexToRGB(hex, alpha);
    color = this.rgbToHSL(color, alpha);
    return color;
  }

  rgbToHex(rgb: string, alpha?: boolean) {
    let start = rgb.indexOf('(') + 1;
    let end = rgb.indexOf(')');
    let [r, g, b, a]: any = rgb.slice(start, end).split(',');

    r = (+r).toString(16);
    g = (+g).toString(16);
    b = (+b).toString(16);
    a = Math.round(a * 255).toString(16);

    if (r.length == 1) {
      r = `0${r}`;
    }

    if (g.length == 1) {
      g = `0${g}`;
    }

    if (b.length == 1) {
      b = `0${b}`;
    }
    if (a.length == 1) {
      a = `0${a}`;
    }

    let hex = '#';

    if (alpha) {
      hex += `${r}${g}${b}${a}`;
    }
    else {
      hex += `${r}${g}${b}`;
    }

    return hex;
  }

  rgbToHSL(rgb: string, alpha = true) {
    let start = rgb.indexOf('(') + 1;
    let end = rgb.indexOf(')');
    let [r, g, b, a]: any = rgb.slice(start, end).split(',');


    r /= 225;
    g /= 225;
    b /= 225;

    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // Calculate hue
    // No difference
    if (delta == 0) {
      h = 0;
    }
    else if (cmax == r) {
      h = ((g - b) / delta) % 6;
    }
    else if (cmax == g) {
      h = (b - r) / delta + 2;
    }
    else if (cmax == g) {
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    // Make negative hues positive behind 360°
    if (h < 0) {
      h += 360;
    }

    l = (cmax + cmin) / 2;

    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    l = +(l * 100).toFixed(1);
    s = +(s * 100).toFixed(1);

    let hsl = `hsl`;
    if (alpha == false) {
      hsl += `(${h}, ${s}%, ${l}%)`;
    }
    else {
      hsl += `(${h}, ${s}%, ${l}%, ${a})`;
    }
    return hsl;
  }

  hslToRGB(hsl: string, alpha = true) {
    let rgb = 'rgb';
    let start = hsl.indexOf('(') + 1;
    let end = hsl.indexOf(')');
    let [h, s, l, a]: any = hsl.slice(start, end).split(',');

    if (h.indexOf("deg") > -1)
      h = h.substr(0, h.length - 3);
    else if (h.indexOf("rad") > -1)
      h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
    else if (h.indexOf("turn") > -1)
      h = Math.round(h.substr(0, h.length - 4) * 360);
    // Keep hue fraction of 360 if ending up over
    if (h >= 360)
      h %= 360;

    s = s.replace('%', '') / 100;
    l = l.replace('%', '') / 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    if (alpha == false) {
      rgb += `(${r}, ${g}, ${b})`;
    }
    else {
      rgb += `(${r}, ${g}, ${b}, ${a})`;
    }

    return rgb;
  }

  hslToHex(hsl: string, alpha = true) {
    let color = this.hslToRGB(hsl, alpha);
    return this.rgbToHex(color, alpha);
  }

  addOpacity(color: string, opacity: number) {
    const isHex = color.includes('#');
    if (isHex) color = this.hexToRGB(color);

    let start = color.indexOf('(') + 1;
    let end = color.indexOf(')');
    let points: any[] = color.slice(start, end).split(',');
    points[3] = opacity;

    let changedColor = `rgba(${points.join(',')})`;

    if (isHex) changedColor = this.rgbToHex(changedColor);

    return changedColor;
  }

  getOpacity(color: string) {
    const a = (color.split(',')[3] || '').replace(')', '').trim();
    const opacity = a ? a : '1';

    return parseFloat(opacity);
  }

  nameToHex(color: string) {
    let ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = color;
    return ctx.fillStyle;
  }

  nameToRGB(color: string) {
    return this.hexToRGB(this.nameToHex(color));
  }

  extractRGB(color: string) {
    return color.toLocaleLowerCase().replace('rgba', '').replace('rgb', '').replace('(', '').replace(')', '');
  }

  extractHSL(color: string) {
    return color.toLocaleLowerCase().replace('hsl', '').replace('hsla', '').replace('(', '').replace(')', '');
  }

  invertColor(color: string) {
    let type = this.colorType(color);
    color = this.toRGB(color);

    let [r, g, b, a] = this.extractRGB(color).split(',');
    r = (255 - parseInt(r)).toString();
    g = (255 - parseInt(g)).toString();
    b = (255 - parseInt(b)).toString();

    color = color.includes('rgba') ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;

    if (type == 'hex') {
      color = this.toHEX(color);
    }
    else if (type == 'hsl' || type == 'hsla') {
      color = this.toHSL(color);
    }

    return color;
  }

  colorType(color: string) {
    let type;

    if (color.indexOf('#') == 0 && ((color.length) == 4 || (color.length) == 7 || (color.length) == 9)) {
      type = 'hex';
    }
    else if (color.indexOf('rgb') == 0) {
      let values = this.extractRGB(color).split(',');
      if (values.length == 4) {
        type = 'rgba';
      }
      else {
        type = 'rgb'
      }
    }
    else if (color.indexOf('hsl') == 0) {
      let values = this.extractHSL(color).split(',');
      if (values.length == 4) {
        type = 'hsla';
      }
      else {
        type = 'hsl'
      }
    }

    return type;
  }

  isLight(color: string) {
    color = this.toRGB(color);

    const [r, g, b] = this.extractRGB(color).split(',');
    const hsp = Math.sqrt(
      0.299 * (parseInt(r) * parseInt(r)) +
      0.587 * (parseInt(g) * parseInt(g)) +
      0.114 * (parseInt(b) * parseInt(b))
    );

    return hsp > 127.5;
  }

  toHEX(color: string) {
    let type = this.colorType(color);
    if (type == 'rgb' || type == 'rgba') {
      color = this.rgbToHex(color);
    }
    else if (type == 'hsl' || type == 'hsla') {
      color = this.hslToHex(color);
    }
    else{
      color = this.nameToHex(color);
    }

    return color;
  }

  toRGB(color: string) {
    let type = this.colorType(color);

    if (type == 'hex') {
      color = this.hexToRGB(color);
    }
    else if (type == 'hsl' || type == 'hsla') {
      color = this.hslToRGB(color);
    }

    return color;
  }

  toHSL(color: string) {
    let type = this.colorType(color);
    if (type == 'hex') {
      color = this.hexToHSL(color);
    }
    else if (type == 'rgb' || type == 'rgba') {
      color = this.rgbToHSL(color);
    }

    return color;
  }

  averageImageColor(image: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const rgba: RGBA = { r: 0, g: 0, b: 0, a: 1 };
    const blockSize = 5;
    let i = -4, count = 0;

    context?.drawImage(image, 0, 0);
    try {
      const imageData = context?.getImageData(0, 0, image.width, image.height);
      const pixels = imageData?.data as Uint8ClampedArray;

      while ((i += blockSize * 4) < pixels.length) {
        ++count;
        rgba.r += pixels[i];
        rgba.g += pixels[i + 1];
        rgba.b += pixels[i + 2];
      }

      // ~~ used to floor values
      rgba.r = ~~(rgba.r / count);
      rgba.g = ~~(rgba.g / count);
      rgba.b = ~~(rgba.b / count);

    } catch (error) {
      // cross-site security
      console.log('Cross site security, Image on another domain. Add crossorigin="anonymous" to img');
    }

    return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
  }

  elementToCanvas(element: HTMLElement) {

  }

  shadeColor(color: string, amount: number) {
    color = this.toHEX(color);

    const shade = '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));

    return shade;
  }
}

export class ColorPickerServiceConfig {
  defaultColors?: string[];
  systemColors?: string[];
}
