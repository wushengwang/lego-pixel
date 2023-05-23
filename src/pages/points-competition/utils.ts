import DeltaE from 'delta-e';

// rgb转为lab
const rgb2lab = function ({ r, g, b }: {r: number, g: number, b: number}) {
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
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
  }

  // 计算颜色距离
export const calDistance = (current: {r: number, g: number, b: number}, source: {r: number, g: number, b: number}) => {
    const [cl, ca, cb] = rgb2lab(current);
    const [sl, sa, sb] = rgb2lab(source);
  
    const distance = DeltaE.getDeltaE00(
      { L: cl, A: ca, B: cb },
      { L: sl, A: sa, B: sb }
    );
    return distance;
  };
  

  export const getNearColor = (color: {r: number, g: number, b: number}): [{r: number, g: number, b: number}, string, string] => {
    let distance = Infinity
    let xxxC = {r: 0, g: 0, b: 0}
    let hex = ''
    let num = '';
    LegoColors.map(i => {
        const tC = hexToRgb(i.color)
        const d = calDistance(color, tC)
        if(d<distance) {
            xxxC = tC
            distance = d
            num = i.colorNum
            hex = i.color
        }
    })
    return [xxxC, num, hex]
}

export const LegoColors = [
    { colorDesc: "白", color: "#F4F4F4", colorNum: "001" },
    { colorDesc: "砂色", color: "#CCB98D", colorNum: "005" },
    { colorDesc: "膚色", color: "#BB805A", colorNum: "018" },
    { colorDesc: "紅色", color: "#B40000", colorNum: "021" },
    { colorDesc: "藍色", color: "#1E5AA8", colorNum: "023" },
    { colorDesc: "黃色", color: "#FAC80A", colorNum: "024" },
    { colorDesc: "黑色", color: "#1B2A34", colorNum: "026" },
    { colorDesc: "綠色", color: "#00852B", colorNum: "028" },
    { colorDesc: "亮綠色", color: "#58AB41", colorNum: "037" },
    { colorDesc: "深橘色", color: "#91501C", colorNum: "038" },
    { colorDesc: "灰藍色", color: "#7396C8", colorNum: "102" },
    { colorDesc: "橘色", color: "#D67923", colorNum: "106" },
    { colorDesc: "檸檬綠色", color: "#A5CA18", colorNum: "119" },
    { colorDesc: "紫紅色", color: "#901F76", colorNum: "124" },
    { colorDesc: "砂藍色", color: "#70819A", colorNum: "135" },
    { colorDesc: "深砂色", color: "#897D62", colorNum: "138" },
    { colorDesc: "深藍色", color: "#19325A", colorNum: "140" },
    { colorDesc: "深綠色", color: "#00451A", colorNum: "141" },
    { colorDesc: "砂綠色", color: "#708E7C", colorNum: "151" },
    { colorDesc: "暗紅色", color: "#720012", colorNum: "154" },
    { colorDesc: "亮橘色", color: "#FCAC00", colorNum: "191" },
    { colorDesc: "紅棕色", color: "#5F3109", colorNum: "192" },
    { colorDesc: "淺灰色", color: "#969696", colorNum: "194" },
    { colorDesc: "深灰色", color: "#646464", colorNum: "199" },
    { colorDesc: "亮藍色", color: "#9DC3F7", colorNum: "212" },
    { colorDesc: "暗粉紅色", color: "#D3359D", colorNum: "221" },
    { colorDesc: "粉紅色", color: "#FF9ECD", colorNum: "222" },
    { colorDesc: "淡黃色", color: "#FFEC6C", colorNum: "226" },
    { colorDesc: "深紫色", color: "#441A91", colorNum: "268" },
    { colorDesc: "淺膚色", color: "#FFC995", colorNum: "283" },
    { colorDesc: "深棕色", color: "#352100", colorNum: "308" },
    { colorDesc: "深膚色", color: "#AA7D55", colorNum: "312" },
    { colorDesc: "深天空藍色", color: "#469BC3", colorNum: "321" },
    { colorDesc: "天空藍色", color: "#68C3E2", colorNum: "322" },
    { colorDesc: "淺水青色", color: "#D3F2EA", colorNum: "323" },
    { colorDesc: "粉紫色", color: "#A06EB9", colorNum: "324" },
    { colorDesc: "淡紫色", color: "#CDA4DE", colorNum: "325" },
    { colorDesc: "黃綠色", color: "#E2F99A", colorNum: "326" },
    { colorDesc: "橄欖綠色", color: "#8B844F", colorNum: "330" },
    { colorDesc: "珊瑚色", color: "#FF6D77", colorNum: "353" },
  ];
  
