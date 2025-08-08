import React from "react";

export const copyText = (text: string) => {
  try {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Content copied to clipboard");
      },
      () => {
        console.error("Failed to copy");
      }
    );
  } catch (e) {
    console.error("Failed to init navigator", e);
  }
};
export const CopyButton = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  const onClick = () => {
    copyText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };
  return (
    <i
      className={`text-lg relative top-[1px] ${
        copied
          ? "fa-solid fa-check-double text-[#23ed37]"
          : "fa-solid fa-copy cursor-pointer"
      } ${className}`}
      onClick={onClick}
    ></i>
  );
};
