import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useLocalStorageState } from "ahooks";
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

export default function Upload() {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [{ h }, setHeight] = useLocalStorageState<Record<string, number>>(
    `message-once-control`,
    {
      defaultValue: { h: 400 },
    }
  );
  const [imgSrc, setSrc] = useState("");
  const [ld, setL] = useState(0);
  const [dd, setD] = useState(1);
  const [x, setX] = useState<{ colorNum: string; color: string }[][]>([]);
  const [y, sety] = useState<Record<string, { num: number; color: string }>>(
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

  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("canvas#display");
    const ctx = canvas?.getContext?.("2d");
    const image = document.getElementById("sss") as HTMLImageElement;
    if (!ctx || !image || !canvas) {
      return;
    }
    console.log(previewSrc, h, dd, ld);
    ctx.clearRect(0, 0, 400, h);
    ctx.drawImage(image, 0, 0, 400, h);
    const { arr, x } = ps(ctx, 400, h, dd, ld);
    setX(arr);
    sety(x);
  }, [previewSrc, h, dd, ld]);

  const xx = async () => {
    const target = document.getElementById("pdf");
    if (!target) {
      return;
    }
    const canvas = await html2canvas(target, {
      backgroundColor: "#FFF",
      removeContainer: true,
    });
    const pdf = new jsPDF("p", "px", [1240, Math.round((h * 3) / 1754) * 1754]);

    const pageData = canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(pageData, "JPEG", 20, 0, 1200, h * 3);
    pdf.save("图纸.pdf");
  };

  return (
    <section className="mt-10">
      <input
        className="hidden"
        type="file"
        accept="image/*"
        id="imgReader"
        onChange={loadingImg}
      />
      <div style={{ height: h }} className="w-full] flex justify-center">
        <div className="w-[400px] h-full mx-4">
          <Cropper
            src={imgSrc}
            style={{ height: h, width: 400, background: "#fff" }}
            aspectRatio={400 / h}
            guides
            crop={onCrop}
            ref={cropperRef}
          />
        </div>
        <div className="text-center w-[400px] h-full mx-4">
          {previewSrc ? (
            <img
              id="sss"
              className="w-full h-full inline-block"
              src={previewSrc}
              alt=""
            />
          ) : null}
        </div>
        <div className="text-center w-[400px] h-full mx-4">
          {x.map((i, ii) => {
            return (
              <div key={ii} className="p-0 m-0 h-1">
                {i.map((j, jj) => (
                  <span
                    key={j.colorNum + jj}
                    className="inline-block"
                    style={{
                      background: j.color,
                      width: 4,
                      height: 4,
                      borderRadius: 4,
                    }}
                  ></span>
                ))}
              </div>
            );
          })}
        </div>
        <canvas
          width={400}
          height={h}
          id="display"
          className="mx-4 fixed left-[-4000px]"
        ></canvas>
      </div>

      <div className="flex justify-center items-center my-10">
        <TaskBtn onClick={onSelect}>选择图片</TaskBtn>
        <TaskBtn
          className="ml-10"
          onClick={() => {
            setHeight({ h: h === 1200 ? 400 : 1200 });
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          }}
        >
          切换高度
        </TaskBtn>
        <TaskBtn className="ml-10" onClick={xx}>
          下载说明
        </TaskBtn>
        <div className="w-[200px] ml-10 text-center">
          <span>亮度</span>
          <Slider
            aria-label="slider-ex-1"
            min={-100}
            max={100}
            step={1}
            value={ld}
            onChange={setL}
            defaultValue={0}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>
        <div className="w-[200px] ml-10 text-center">
          <span>对比度</span>
          <Slider
            aria-label="slider-ex-1"
            value={dd}
            step={0.01}
            onChange={setD}
            min={0}
            max={2}
            defaultValue={1}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>
        <span className="ml-10">总颜色：{Object.keys(x).length}</span>
        <span className="ml-10">
          总颗粒：{Object.values(y).reduce((a, b) => a + b.num, 0)}
        </span>
        <span className="ml-10">高度：{h}</span>
      </div>
      <div id="pdf" className="w-[1800px] mx-auto">
        <ul className="flex gap-1 flex-wrap">
          <li className="inline-flex items-center flex-col">
            <span
              className="inline-block w-20 h-20"
              style={{ background: "#fff" }}
            ></span>
            <span className="text-xcyan">色值编号</span>
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
                <span className="text-xpink">{num}</span>
              </li>
            );
          })}
        </ul>
        <div className="text-center my-10">
          {x.map((i, ii) => {
            return (
              <div key={ii} className="p-0 m-0 h-10 flex justify-between">
                {i.map((j, jj) => (
                  <span
                    key={j.colorNum + jj}
                    style={{
                      background: j.color,
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
    </section>
  );
}

const ps = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  d: number,
  l: number
) => {
  let arr: { colorNum: string; color: string }[][] = [];
  const poly = Math.round(width / 45);
  let x: Record<string, { num: number; color: string }> = {};
  //取得图像数据
  const canvasData = ctx.getImageData(0, 0, width, height);
  let area = {};
  let count = 0;
  for (let x = 0; x < height; x += poly) {
    count++;
    for (let y = 0; y < width; y += poly) {
      area = {
        w: y + poly > width ? parseInt(`${width % poly}`) : poly,
        h: count * poly > height ? parseInt(`${height % poly}`) : poly,
      };
      const idx = (y + x * width) * 4;
      const { colorNum, color } = averageColors(idx, area);
      if (!arr[count]) {
        arr[count] = [];
      }
      arr[count].push({ colorNum, color });
    }
  }
  console.log(JSON.stringify(arr));

  ctx.putImageData(canvasData, 0, 0);

  function averageColors(idx: number, area: { w?: number; h?: number }) {
    let aveR = aveColors(idx, area);
    let aveG = aveColors(idx + 1, area);
    let aveB = aveColors(idx + 2, area);

    const [{ r, g, b }, colorNum, color] = getNearColor({
      r: aveR,
      g: aveG,
      b: aveB,
    });
    const key = colorNum || `x_${r}_${g}_${b}`;
    x[key] = x[key] ? { color, num: x[key].num + 1 } : { num: 1, color };
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
      Math.floor(Math.min((total / (area.w * area.h)) * d + l, 255) / 25) * 25
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
