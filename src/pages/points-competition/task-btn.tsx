import classNames from "classnames";
import React, { FC, PropsWithChildren } from "react";

interface ITaskBtnProps {
  className?: string;
  onClick?(): void;
}

export const TaskBtn: FC<PropsWithChildren<ITaskBtnProps>> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <button
      className={classNames(
        "inline-block text-center font-termina font-xbold text-[#080808] leading-1 w-[179px] h-[61px] text-x-base overflow-ellipsis focus-visible:outline-none bg-xpink rounded-[10px]",
        className
      )}
      onClick={onClick}
    >
      <span
        className={classNames(
          "font-termina font-xbold leading-tight inline-block"
        )}
      >
        {children}
      </span>
    </button>
  );
};
