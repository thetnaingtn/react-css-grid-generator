import React, { useState, useContext, useRef, MouseEventHandler } from "react";

import GridContext from "../context/gridContext";
import FormContext from "../context/formContext";

import { AppCode } from "../components";

export default function AppCodeContainer() {
  let { rowGap, columnGap } = useContext(FormContext);
  let { childArea, rowTemplate, columnTemplate } = useContext(GridContext);
  let [showHtml, setShowHtml] = useState(false);
  let [codeWasCopied, setCodeWasCopied] = useState(false);
  let codeRef = useRef<HTMLDivElement | null>(null);

  const copy: MouseEventHandler = (event) => {
    setCodeWasCopied(true);
    let text = codeRef.current;
    let selection = window.getSelection();
    let range = document.createRange();
    if (!range || !selection || !text) return;
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    let copied = document.execCommand("copy");
    if (copied) {
      setTimeout(() => {
        setCodeWasCopied(false);
      }, 3000);
    }
  };

  return (
    <AppCode>
      <AppCode.Title>Copy the code below:</AppCode.Title>
      <AppCode.GridCode>
        <AppCode.ButtonToggle
          onClick={() => setShowHtml(!showHtml)}
          role="region"
          type="button"
        >
          {showHtml ? "Show CSS" : "Show HTML"}
        </AppCode.ButtonToggle>
        <AppCode.ButtonCopy
          onClick={copy}
          role="region"
          id="codeCopyStatus"
          type="button"
        >
          {codeWasCopied ? "Code Copied" : "Copy to Clipboard"}
        </AppCode.ButtonCopy>
        <div id="code" ref={codeRef}>
          {showHtml ? (
            <p>
              &lt;
              <AppCode.CName>div</AppCode.CName>
              <AppCode.CProps> class="parent"</AppCode.CProps>&gt;
              <br />
              {childArea.length > 0 ? (
                <span>
                  {childArea.map((area, i) => (
                    <span key={area}>
                      <AppCode.Sp>
                        &lt;<AppCode.CName>div</AppCode.CName>
                        <AppCode.CProps>
                          &nbsp;class="div{i + 1}"
                        </AppCode.CProps>
                        &gt;&lt;/<AppCode.CName>div</AppCode.CName>&gt;
                      </AppCode.Sp>
                      <br />
                    </span>
                  ))}
                </span>
              ) : (
                <span>
                  <br />
                </span>
              )}
              &lt;/<AppCode.CName>div</AppCode.CName>&gt;
            </p>
          ) : (
            <>
              <p>
                <AppCode.CName>.parent</AppCode.CName>
                {"{"}
                <br />
                <AppCode.Sp>
                  <AppCode.CKey>display</AppCode.CKey>:
                  <AppCode.CProps>grid</AppCode.CProps>;
                </AppCode.Sp>
                <br />
                <AppCode.Sp>
                  <AppCode.CKey>grid-template-columns</AppCode.CKey>:
                  <AppCode.CProps>{columnTemplate}</AppCode.CProps>;
                </AppCode.Sp>
                <br />
                <AppCode.Sp>
                  <AppCode.CKey>grid-template-rows</AppCode.CKey>:
                  <AppCode.CProps>{rowTemplate}</AppCode.CProps>;
                </AppCode.Sp>
                <br />
                <AppCode.Sp>
                  <AppCode.CKey>grid-column-gap</AppCode.CKey>:
                  <AppCode.CProps>{columnGap}px;</AppCode.CProps>
                </AppCode.Sp>
                <br />
                <AppCode.Sp>
                  <AppCode.CKey>grid-row-gap</AppCode.CKey>:
                  <AppCode.CProps>{rowGap}px</AppCode.CProps>;
                </AppCode.Sp>
                <br />
                {"}"}
              </p>
              <p>
                {childArea.length > 0 ? (
                  <span>
                    {childArea.map((area, i) => (
                      <span key={area}>
                        <AppCode.CName>.div{i + 1}</AppCode.CName>
                        {"{"}
                        <AppCode.CKey>grid-area: </AppCode.CKey>
                        <AppCode.CProps>{area}</AppCode.CProps>
                        {"}"}
                        <br />
                      </span>
                    ))}
                  </span>
                ) : null}
              </p>
            </>
          )}
        </div>
      </AppCode.GridCode>
    </AppCode>
  );
}
