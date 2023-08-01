import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useLocalStorageState, useResponsive, configResponsive } from "ahooks";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { getNearColor } from "./utils";
import { TaskBtn } from "./task-btn";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

configResponsive({
    md: 500,
  });

const Step = 10
const Pixcel = 48
const Width = Pixcel * Step;


export default function Upload() {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [{ h }, setHeight] = useLocalStorageState<Record<string, number>>(
    `message-once-control`,
    {
      defaultValue: { h: Width },
    }
  );
  const [imgSrc, setSrc] = useState("");
  const [ld, setL] = useState(0.2);
  const [dd, setD] = useState(0.2);
  const [b, setB] = useState(0.2);
  const [hue, setHue] = useState(0);
  const [x, setX] = useState<{ colorNum: string; color: string }[][]>([]);
  const [y, sety] = useState<Record<string, { num: number; color: string, colorDesc: string, enColorDesc: string }>>(
    {}
  );
  const [previewSrc, setPreviewSrc] = useState("");
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setPreviewSrc(cropper.getCroppedCanvas().toDataURL());
  };
  const onSelect = useCallback(() => {
    const inputEle: HTMLInputElement | null =
      document.querySelector("#imgReader");
    inputEle && inputEle.click();
  }, []);

  const loadingImg: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      let reader = new FileReader();
      const file = event.target?.files?.[0];
      if (file) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const dataURL = reader.result?.toString();
          if (dataURL) {
            setSrc(dataURL);
          }
        };
      }
    },
    []
  );

  const res = useResponsive()

  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("canvas#display");
    const ctx = canvas?.getContext?.("2d");
    const image = document.getElementById("sss") as HTMLImageElement;
    if (!ctx || !image || !canvas) {
      return;
    }
    ctx.filter=`saturate(${b * 5}) hue-rotate(${hue * 144}deg) brightness(${ld *5}) contrast(${dd * 5})`
    ctx.clearRect(0, 0, Width, h);
    ctx.drawImage(image, 0, 0, Width, h);
    const { arr, x } = ps(ctx, Width, h);
    setX(arr);
    sety(x);
  }, [previewSrc, h, dd, ld, b, hue]);

  

  return (
    <section className="pt-10">
      <input
        className="hidden"
        type="file"
        accept="image/*"
        id="imgReader"
        onChange={loadingImg}
      />
      <div className="flex h-[60px] justify-center items-center my-10">
        <TaskBtn onClick={onSelect}>选择图片</TaskBtn>
        <TaskBtn
          className="ml-10"
          onClick={() => {
            setHeight({ h: Width });
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          }}
        >
         1*1
        </TaskBtn>
        <TaskBtn
          className="ml-10"
          onClick={() => {
            setHeight({ h: Width * 2});
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          }}
        >
         1*2
        </TaskBtn>
        <TaskBtn
          className="ml-10"
          onClick={() => {
            setHeight({ h:  Width * 3  });
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          }}
        >
          1*3
        </TaskBtn>
        <TaskBtn className="ml-10" onClick={savePdf}>
          下载说明
        </TaskBtn>
      </div>
      <div className="flex h-12 justify-center items-center gap-x-10 my-10">
        <span className="cur-pointer" onClick={() => {
            setL(0.2);
            setD(0.2);
            setB(0.2);
            setHue(0);
        }}>reset</span>
        <div className="w-[150px] text-center">
          <span>亮度</span>
          <Slider
            aria-label="slider-ex-1"
            min={0}
            max={1}
            step={0.01}
            value={ld}
            onChange={setL}
            defaultValue={0.2}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>

        <div className="w-[150px] text-center">
          <span>饱和度</span>
          <Slider
            aria-label="slider-ex-1"
            min={0}
            max={1}
            step={0.01}
            value={b}
            onChange={setB}
            defaultValue={0.2}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>
        <div className="w-[150px] text-center">
          <span>色调</span>
          <Slider
            aria-label="slider-ex-1"
            min={0}
            max={1}
            step={0.01}
            value={hue}
            onChange={setHue}
            defaultValue={0}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>
        
        <div className="w-[150px] ml-10 text-center">
          <span>对比度</span>
          <Slider
            aria-label="slider-ex-1"
            value={dd}
            step={0.01}
            onChange={setD}
            min={0}
            max={1}
            defaultValue={0.2}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>
      </div>
      <div className="flex justify-center h-6 items-center my-10">
        <span>总颜色：{Object.keys(y).length}</span>
        <span className="ml-10">
          总颗粒：{Object.keys(y).map((i) =>  y[i].num).reduce((a, b) => a + b, 0)}
        </span>
        <span className="ml-10">高度：{h}</span>
      </div>
      <div style={{height: res.md ? h + 50 : h*2 + 50}} className="w-full overflow-x-hidden flex flex-col md:flex-row items-center justify-center">
        <div style={{ width: Width, height: h }} className="">
          <Cropper
            src={imgSrc}
            style={{ height: h, width: Width, background: "#fff" }}
            aspectRatio={Width / h}
            guides
            crop={onCrop}
            ref={cropperRef}
          />
        </div>
        <div style={{ width: Width, height: h }} className="text-center">
          {x.map((i, ii) => {
            return (
              <div key={ii} className="p-0 m-0" style={{ height: Width / Pixcel }}>
                {i.map((j, jj) => (
                  <span
                    key={j.colorNum + jj}
                    className="inline-block"
                    style={{
                      background: j.color,
                      width: Width / Pixcel,
                      height: Width / Pixcel,
                      borderRadius: Width / Pixcel,
                    }}
                  ></span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full overflow-auto mx-auto">
        <div id="pdf" className="w-[1800px] h-auto mx-auto">
          <ul className="flex gap-1 flex-wrap">
            <li className="inline-flex items-center flex-col">
              <span
                className="inline-block w-20 h-20"
                style={{ background: "#fff" }}
              ></span>
              <span className="text-xcyan">色值编号</span>
              <span className="text-xpink">色值名称-en</span>
              <span className="text-xcyan">色值名称-cn</span>
              <span className="text-xpink">所需数量</span>
            </li>
            {Object.keys(y).map((i) => {
              const color = y[i].color;
              const num: number = y[i].num;
              return (
                <li key={i} className="inline-flex items-center flex-col">
                  <span
                    className="inline-block w-20 h-20"
                    style={{ background: color }}
                  ></span>
                  <span className="text-xcyan">{i}</span>
                  <span className="text-xpink">{y[i].enColorDesc}</span>
                  <span className="text-xcyan">{y[i].colorDesc}</span>
                  <span className="text-xpink">{num}</span>
                </li>
              );
            })}
          </ul>
          <div className="text-center my-10">
            {x.map((i, ii) => {
              return (
                <div key={ii} style={{marginBottom: !((ii/10 + 1) % 16) ? 10 : 0}} className="p-0 m-0 h-10 flex justify-between">
                  {i.map((j, jj) => (
                    <span
                      key={j.colorNum + jj}
                      style={{
                        background: j.color,
                        marginRight: !((jj+1)% 16) ? 10 : 0,
                        
                      }}
                      className="w-10 h-10 inline-block leading-[40px] text-center rounded-full text-xs text-white"
                    >
                      {j.colorNum}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{ width: Width }}
        className="text-center h-full mx-4 fixed left-[-4000px]"
      >
        {previewSrc ? (
          <img
            id="sss"
            className="w-full h-full inline-block"
            src={previewSrc}
            alt=""
          />
        ) : null}
      </div>
      <canvas
        width={Width + 100}
        height={h + 100}
        id="display"
        className="mx-4 fixed left-[-4000px]"
      ></canvas>
    </section>
  );
}

const ps = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  let arr: { colorNum: string; color: string }[][] = [];
  const poly = Step;
  let x: Record<string, { num: number; color: string, colorDesc: string, enColorDesc: string }> = {};
  //取得图像数据
  const canvasData = ctx.getImageData(0, 0, width, height);
  let area = {};
  for (let x = 0; x < height; x += poly) {
    console.log(x, height, poly)
    for (let y = 0; y < width; y += poly) {
      area = {
        w: poly,
        h: poly,
      };
      const idx = (y + x * width) * 4;
      const { colorNum, color } = averageColors(idx, area);
      if (!arr[x]) {
        arr[x] = [];
      }
      arr[x].push({ colorNum, color });
    }
  }

  ctx.putImageData(canvasData, 0, 0);

  function averageColors(idx: number, area: { w?: number; h?: number }) {
    let aveR = aveColors(idx, area);
    let aveG = aveColors(idx + 1, area);
    let aveB = aveColors(idx + 2, area);

    const [{ r, g, b }, colorNum, color, colorDesc, enColorDesc] = getNearColor({
      r: aveR,
      g: aveG,
      b: aveB,
    });
    const key = colorNum || `x_${r}_${g}_${b}`;
    x[key] = x[key] ? { color, num: x[key].num + 1 ,colorDesc, enColorDesc} : { num: 1, color, colorDesc, enColorDesc };
    fullColors(idx, { aveR: r, aveG: g, aveB: b }, area);
    return { color, colorNum };
  }
  function aveColors(idx: number, area: any) {
    let total = 0;
    for (let i = 0; i < area.h; i++) {
      for (let j = 0; j < area.w; j++) {
        if (canvasData.data[idx + j * 4 + width * i * 4]) {
          total += canvasData.data[idx + j * 4 + width * i * 4];
        }
      }
    }
    return (
      Math.ceil(Math.min((total / (area.w * area.h)), 255) / 25) * 25
    );
  }


  function fullColors(idx: number, rgb: any, area: any) {
    for (let i = 0; i < area.h; i++) {
      for (let j = 0; j < area.w; j++) {
        canvasData.data[idx + 0 + j * 4 + width * i * 4] = rgb.aveR;
        canvasData.data[idx + 1 + j * 4 + width * i * 4] = rgb.aveG;
        canvasData.data[idx + 2 + j * 4 + width * i * 4] = rgb.aveB;
      }
    }
  }
  return { arr, x };
};


const savePdf = async () => {
  const target = document.getElementById("pdf");
  if (!target) {
    return;
  }
  const canvas = await html2canvas(target, {
    backgroundColor: "#FFF",
    removeContainer: true,
  });
  const pdfH = target.clientHeight / target.clientWidth * 1800
  const pdf = new jsPDF("p", "px", [1900, pdfH + 200]);
  const pageData = canvas.toDataURL("image/jpeg", 1);
  pdf.addImage(pageData, "JPEG", 50, 0, 1800, pdfH);
  pdf.save("图纸.pdf");
};

