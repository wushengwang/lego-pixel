import DeltaE from "delta-e";

// rgb转为lab
const rgb2lab = function ({ r, g, b }: { r: number; g: number; b: number }) {
  r /= 255.0; // rgb range: 0 ~ 1
  g /= 255.0;
  b /= 255.0;
  // gamma 2.2
  if (r > 0.04045) {
    r = Math.pow((r + 0.055) / 1.055, 2.4);
  } else {
    r = r / 12.92;
  }
  if (g > 0.04045) {
    g = Math.pow((g + 0.055) / 1.055, 2.4);
  } else {
    g = g / 12.92;
  }
  if (b > 0.04045) {
    b = Math.pow((b + 0.055) / 1.055, 2.4);
  } else {
    b = b / 12.92;
  }
  // sRGB
  let X = r * 0.436052025 + g * 0.385081593 + b * 0.143087414;
  let Y = r * 0.222491598 + g * 0.71688606 + b * 0.060621486;
  let Z = r * 0.013929122 + g * 0.097097002 + b * 0.71418547;
  // XYZ range: 0~100
  X = X * 100.0;
  Y = Y * 100.0;
  Z = Z * 100.0;
  // Reference White Point
  const ref_X = 96.4221;
  const ref_Y = 100.0;
  const ref_Z = 82.5211;
  X = X / ref_X;
  Y = Y / ref_Y;
  Z = Z / ref_Z;
  // Lab
  if (X > 0.008856) {
    X = Math.pow(X, 1 / 3.0);
  } else {
    X = 7.787 * X + 16 / 116.0;
  }
  if (Y > 0.008856) {
    Y = Math.pow(Y, 1 / 3.0);
  } else {
    Y = 7.787 * Y + 16 / 116.0;
  }
  if (Z > 0.008856) {
    Z = Math.pow(Z, 1 / 3.0);
  } else {
    Z = 7.787 * Z + 16 / 116.0;
  }

  const lab_L = 116.0 * Y - 16.0;
  const lab_A = 500.0 * (X - Y);
  const lab_B = 200.0 * (Y - Z);

  return [lab_L, lab_A, lab_B];
};

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// 计算颜色距离
export const calDistance = (
  current: { r: number; g: number; b: number },
  source: { r: number; g: number; b: number }
) => {
  const [cl, ca, cb] = rgb2lab(current);
  const [sl, sa, sb] = rgb2lab(source);

  const distance = DeltaE.getDeltaE00(
    { L: cl, A: ca, B: cb },
    { L: sl, A: sa, B: sb }
  );
  return distance;
};

export const getNearColor = (color: {
  r: number;
  g: number;
  b: number;
}): [{ r: number; g: number; b: number }, string, string, string, string] => {
  let distance = Infinity;
  let xxxC = { r: 0, g: 0, b: 0 };
  let hex = "";
  let num = "";
  let colorDesc = "";
  let enDesc = "";
  LegoColors.map((i) => {
    const tC = hexToRgb(i.color);
    const d = calDistance(color, tC);
    if (d < distance) {
      xxxC = tC;
      distance = d;
      num = i.colorNum;
      hex = i.color;
      colorDesc = i.colorDesc || "";
      enDesc = i.enDesc || "";
    }
  });
  return [xxxC, num, hex, colorDesc, enDesc];
};

export const LegoColors = [
  { colorDesc: "白", color: "#F4F4F4", colorNum: "001", enDesc: "White" },
  {
    colorDesc: "砖黄色",
    color: "#CCB98D",
    colorNum: "005",
    enDesc: "Brick Yellow",
  },
  { colorDesc: "肤色", color: "#BB805A", colorNum: "018", enDesc: "Nougat" },
  {
    colorDesc: "红色",
    color: "#B40000",
    colorNum: "021",
    enDesc: "Bright Red",
  },
  {
    colorDesc: "蓝色",
    color: "#1E5AA8",
    colorNum: "023",
    enDesc: "Bright Blue",
  },
  {
    colorDesc: "黃色",
    color: "#FAC80A",
    colorNum: "024",
    enDesc: "Bright Yellow",
  },
  { colorDesc: "黑色", color: "#1B2A34", colorNum: "026", enDesc: "Black" },
  {
    colorDesc: "绿色",
    color: "#00852B",
    colorNum: "028",
    enDesc: "Dark Green",
  },
  {
    colorDesc: "亮绿色",
    color: "#58AB41",
    colorNum: "037",
    enDesc: "Bright Green",
  },
  {
    colorDesc: "深橘色",
    color: "#91501C",
    colorNum: "038",
    enDesc: "Dark Orange",
  },
  {
    colorDesc: "灰蓝色",
    color: "#7396C8",
    colorNum: "102",
    enDesc: "Medium Blue",
  },
//   {
//     colorDesc: "橘色",
//     color: "#D67923",
//     colorNum: "106",
//     enDesc: "Bright Orange",
//   },
  {
    colorDesc: "柠檬绿色",
    color: "#A5CA18",
    colorNum: "119",
    enDesc: "Bright Yellowish Green",
  },
  {
    colorDesc: "紫红色",
    color: "#901F76",
    colorNum: "124",
    enDesc: "Bright Reddish Violet",
  },
  {
    colorDesc: "沙蓝色",
    color: "#70819A",
    colorNum: "135",
    enDesc: "Sand Blue",
  },
  {
    colorDesc: "沙黄色",
    color: "#897D62",
    colorNum: "138",
    enDesc: "Sand Yellow",
  },
  {
    colorDesc: "深蓝色",
    color: "#19325A",
    colorNum: "140",
    enDesc: "Earth Blue",
  },
  {
    colorDesc: "深绿色",
    color: "#00451A",
    colorNum: "141",
    enDesc: "Earth Green",
  },
  {
    colorDesc: "沙绿色",
    color: "#708E7C",
    colorNum: "151",
    enDesc: "Sand Green",
  },
  {
    colorDesc: "暗红色",
    color: "#720012",
    colorNum: "154",
    enDesc: "(New) Dark Red",
  },
  {
    colorDesc: "亮橘色",
    color: "#FCAC00",
    colorNum: "191",
    enDesc: "Flame Yellowish Orange",
  },
  {
    colorDesc: "红棕色",
    color: "#5F3109",
    colorNum: "192",
    enDesc: "Reddish Brown",
  },
  {
    colorDesc: "淺灰色",
    color: "#969696",
    colorNum: "194",
    enDesc: "Medium Stone Grey",
  },
  {
    colorDesc: "深灰色",
    color: "#646464",
    colorNum: "199",
    enDesc: "Dark Stone Grey",
  },
  {
    colorDesc: "亮蓝色",
    color: "#9DC3F7",
    colorNum: "212",
    enDesc: "Light Royal Blue",
  },
  {
    colorDesc: "暗粉红色",
    color: "#D3359D",
    colorNum: "221",
    enDesc: "Bright Purple",
  },
  {
    colorDesc: "粉红色",
    color: "#FF9ECD",
    colorNum: "222",
    enDesc: "Light Purple",
  },
  {
    colorDesc: "淡黃色",
    color: "#FFEC6C",
    colorNum: "226",
    enDesc: "Cool Yellow",
  },
  {
    colorDesc: "淡黃色",
    color: "#E4CD9E",
    colorNum: "371",
    enDesc: "Tan",
  },
  {
    colorDesc: "深紫色",
    color: "#441A91",
    colorNum: "268",
    enDesc: "Medium Lilac",
  },
  {
    colorDesc: "淺肤色",
    color: "#FFC995",
    colorNum: "283",
    enDesc: "Light Nougat",
  },
  {
    colorDesc: "深棕色",
    color: "#352100",
    colorNum: "308",
    enDesc: "Dark Brown",
  },
  {
    colorDesc: "深肤色",
    color: "#AA7D55",
    colorNum: "312",
    enDesc: "Medium Nougat",
  },
  {
    colorDesc: "深天空蓝色",
    color: "#469BC3",
    colorNum: "321",
    enDesc: "Dark Azur",
  },
  {
    colorDesc: "天空蓝色",
    color: "#68C3E2",
    colorNum: "322",
    enDesc: "Medium Azur",
  },
  { colorDesc: "淺水青色", color: "#D3F2EA", colorNum: "323", enDesc: "Aqua" },
  {
    colorDesc: "粉紫色",
    color: "#A06EB9",
    colorNum: "324",
    enDesc: "Medium Lavender",
  },
  {
    colorDesc: "淡紫色",
    color: "#CDA4DE",
    colorNum: "325",
    enDesc: "Lavender",
  },
  {
    colorDesc: "黃绿色",
    color: "#E2F99A",
    colorNum: "326",
    enDesc: "Spring Yellowish Green",
  },
  {
    colorDesc: "橄榄绿色",
    color: "#8B844F",
    colorNum: "330",
    enDesc: "Olive Green",
  },
  {
    colorDesc: "珊瑚色",
    color: "#FF6D77",
    colorNum: "353",
    enDesc: "Vibrant Coral",
  },
];
const xxxx = {
    31207: {
        Bright_Pink: 158,
        White: 550,
        Light_Nougat: 370,
        Bright_Light_Orange: 370,
        Dark_Turquoise: 370,
        Dark_Pink: 370
    },
    31197: {
        Magenta: 46,
        Medium_Azure: 587,
        Dark_Pink: 587,
        Yellow: 587,
        Bright_Pink: 587,
        Dark_Bluish_Gray: 131,
        Blank: 629 
    },
    31203: {
        Bright_Yellowish_Green: 1060,
        Tan: 725,
        Vibrant_Coral: 601,
        Orange: 601,
        Bright_Green: 601,
        Bright_Light_Orange: 599,
        Dark_Turquoise: 1879,
        Dark_Blue: 393,
        Medium_Azure: 1607
    }
}

