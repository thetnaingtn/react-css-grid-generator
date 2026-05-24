import { useState, useContext, useRef, MouseEventHandler } from "react";

import GridContext from "../context/gridContext";
import FormContext from "../context/formContext";

import { AppCode } from "../components";

const cName = "text-code-name";
const cProps = "text-code-props";
const cKey = "text-code-key";
const sp = "pl-5";

const gridCode =
  "relative bg-gradient-to-b from-panel-start to-panel-end shadow-[0_2px_20px_0_#000] p-[15px] rounded border border-teal text-[15px] font-mono max-h-[50vh] overflow-y-scroll [&>p]:m-[5px]";

const buttonCopy =
  "absolute right-0 top-0 m-0 bg-copy-btn px-3 py-2 rounded-tl-none rounded-tr rounded-br-none rounded-bl font-sans cursor-pointer";

const buttonToggle =
  "absolute right-[5px] bottom-[5px] font-sans cursor-pointer";

export default function AppCodeContainer() {
  let { rowGap, columnGap } = useContext(FormContext);
  let { childArea, rowTemplate, columnTemplate } = useContext(GridContext);
  let [showHtml, setShowHtml] = useState(false);
  let [codeWasCopied, setCodeWasCopied] = useState(false);
  let codeRef = useRef<HTMLDivElement | null>(null);

  const copy: MouseEventHandler = () => {
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
      <h3>Copy the code below:</h3>
      <div className={gridCode}>
        <button
          className={buttonToggle}
          onClick={() => setShowHtml(!showHtml)}
          role="region"
          type="button"
        >
          {showHtml ? "Show CSS" : "Show HTML"}
        </button>
        <button
          className={buttonCopy}
          onClick={copy}
          role="region"
          id="codeCopyStatus"
          type="button"
        >
          {codeWasCopied ? "Code Copied" : "Copy to Clipboard"}
        </button>
        <div id="code" ref={codeRef}>
          {showHtml ? (
            <p>
              &lt;
              <span className={cName}>div</span>
              <span className={cProps}> class="parent"</span>&gt;
              <br />
              {childArea.length > 0 ? (
                <span>
                  {childArea.map((_area, i) => (
                    <span key={i}>
                      <span className={sp}>
                        &lt;<span className={cName}>div</span>
                        <span className={cProps}>
                          &nbsp;class="div{i + 1}"
                        </span>
                        &gt;&lt;/<span className={cName}>div</span>&gt;
                      </span>
                      <br />
                    </span>
                  ))}
                </span>
              ) : (
                <span>
                  <br />
                </span>
              )}
              &lt;/<span className={cName}>div</span>&gt;
            </p>
          ) : (
            <>
              <p>
                <span className={cName}>.parent</span>
                {"{"}
                <br />
                <span className={sp}>
                  <span className={cKey}>display</span>:
                  <span className={cProps}>grid</span>;
                </span>
                <br />
                <span className={sp}>
                  <span className={cKey}>grid-template-columns</span>:
                  <span className={cProps}>{columnTemplate}</span>;
                </span>
                <br />
                <span className={sp}>
                  <span className={cKey}>grid-template-rows</span>:
                  <span className={cProps}>{rowTemplate}</span>;
                </span>
                <br />
                <span className={sp}>
                  <span className={cKey}>grid-column-gap</span>:
                  <span className={cProps}>{columnGap}px;</span>
                </span>
                <br />
                <span className={sp}>
                  <span className={cKey}>grid-row-gap</span>:
                  <span className={cProps}>{rowGap}px</span>;
                </span>
                <br />
                {"}"}
              </p>
              <p>
                {childArea.length > 0 ? (
                  <span>
                    {childArea.map((area, i) => (
                      <span key={area}>
                        <span className={cName}>.div{i + 1}</span>
                        {"{"}
                        <span className={cKey}>grid-area: </span>
                        <span className={cProps}>{area}</span>
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
      </div>
    </AppCode>
  );
}
