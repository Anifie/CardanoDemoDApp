import React from "react";
import style from "./Loading.module.scss";

export const Spinner = React.memo(
  (props: {
    size: number | string;
    color: string;
    haveWrapper?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    const spinnerSize = props.size + "px";
    const spinnerStyle = props.color
      ? { "--arc-spinner-color": props.color }
      : {};
    const haveWrapping = props.haveWrapper === true;
    const Wrapper = (props: {
      className: string;
      children: React.ReactNode;
    }) => {
      return haveWrapping ? (
        <div
          style={{ width: "100%", textAlign: "center" }}
          className={props.className}
        >
          {props.children}
        </div>
      ) : (
        <>{props.children}</>
      );
    };
    return (
      <Wrapper className={props.className || ""}>
        <div className={style["tv-spinner"]} style={{ fontSize: spinnerSize }}>
          <div style={spinnerStyle as React.CSSProperties}></div>
        </div>
      </Wrapper>
    );
  }
);
