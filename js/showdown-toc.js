const toc = {
  type: "output",
  filter: function (text, converter, options) {
    const elements = Array.from(
      new DOMParser().parseFromString(text, "text/html").body.childNodes,
    );
    const output = [];
    let headingLevel = null;
    let tocId = null;

    elements.forEach((element) => {
      const trimmedText = element.textContent.trim();

      if (trimmedText === "[toc]") {
        const tocElement = document.createElement("ol");
        tocElement.className = "showdown-toc";
        headingLevel = null;
        tocId = output.length;
        output.push(tocElement);
      } else {
        const results = trimmedText.match(
          /^([\s\S]*?)((?:\\)?\[toc\])([\s\S]*)$/,
        );

        if (results) {
          if (results[2][0] === "\\") {
            element.textContent =
              results[1] + results[2].substring(1) + results[3];
          } else {
            let before =
              results[1].trim().length > 0
                ? createElementWithContent(element, results[1])
                : null;
            let after =
              results[3].trim().length > 0
                ? createElementWithContent(element, results[3])
                : null;

            const toc = document.createElement("ol");
            toc.className = "showdown-toc";

            if (before) output.push(before);
            tocId = output.length;
            output.push(toc);

            element = after || toc;
            headingLevel = null;
          }
        } else if (
          tocId &&
          !headingLevel &&
          element.tagName &&
          element.tagName.match(/^H[1-6]$/)
        ) {
          headingLevel = parseInt(element.tagName.substring(1), 10);
        }

        if (
          tocId &&
          headingLevel &&
          element.tagName &&
          element.tagName.match(/^H[1-6]$/)
        ) {
          const thisLevel = parseInt(element.tagName.substring(1), 10);

          if (thisLevel === headingLevel) {
            addAnchorToTOC(output[tocId], element);
          } else if (thisLevel < headingLevel) {
            tocId = headingLevel = null;
          }
        }

        output.push(element);
      }
    });

    return htmlStringFromElements(output);
  },
};

function createElementWithContent(element, content) {
  if (element.tagName) {
    const newElement = document.createElement(element.tagName);
    newElement.textContent = content;
    return newElement;
  } else {
    return document.createTextNode(content);
  }
}

function addAnchorToTOC(toc, element) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#" + element.id;
  a.textContent = element.textContent;
  li.appendChild(a);
  toc.appendChild(li);
}

function htmlStringFromElements(elements) {
  const div = document.createElement("div");
  elements.forEach((child) => div.appendChild(child));
  return div.innerHTML;
}

// Register the extension.
showdown.extension("toc", toc);
