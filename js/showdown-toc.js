const toc = {
  type: "output",
  filter: function (text, converter, options) {
    const elements = Array.from(
      new DOMParser().parseFromString(text, "text/html").body.childNodes,
    );
    let output = "";
    let headingLevel = null;
    let tocId = null;
    let tocHtml = "";

    elements.forEach((element) => {
      const trimmedText = element.textContent.trim();

      if (trimmedText === "[toc]") {
        tocHtml = '<ol class="showdown-toc"></ol>';
        headingLevel = null;
        tocId = true;
      } else {
        const results = trimmedText.match(
          /^([\s\S]*?)((?:\\)?\[toc\])([\s\S]*)$/,
        );

        if (results) {
          if (results[2][0] === "\\") {
            element.textContent =
              results[1] + results[2].substring(1) + results[3];
            output += element.outerHTML;
          } else {
            let before =
              results[1].trim().length > 0
                ? createElementHtml(element, results[1])
                : "";
            let after =
              results[3].trim().length > 0
                ? createElementHtml(element, results[3])
                : "";

            tocHtml = '<ol class="showdown-toc"></ol>';
            output += before + tocHtml;
            element = after
              ? createFakeElement(element.tagName, results[3])
              : null;
            headingLevel = null;
          }
        } else if (
          tocId &&
          !headingLevel &&
          element.tagName &&
          element.tagName.match(/^H[1-6]$/)
        ) {
          headingLevel = parseInt(element.tagName.substring(1), 10);
          output += element.outerHTML;
        } else if (
          tocId &&
          headingLevel &&
          element.tagName &&
          element.tagName.match(/^H[1-6]$/)
        ) {
          const thisLevel = parseInt(element.tagName.substring(1), 10);

          if (thisLevel === headingLevel) {
            tocHtml = updateTocHtmlWithAnchor(tocHtml, element);
          } else if (thisLevel < headingLevel) {
            tocId = headingLevel = null;
          }
          output += element.outerHTML;
        } else {
          output += element.outerHTML;
        }
      }
    });

    return output;
  },
};

function createElementHtml(originalElement, textContent) {
  if (originalElement.tagName) {
    return `<${originalElement.tagName}>${textContent}</${originalElement.tagName}>`;
  }
  return textContent;
}

function createFakeElement(tagName, textContent) {
  const fakeElement = document.createElement(tagName);
  fakeElement.textContent = textContent;
  return fakeElement;
}

function updateTocHtmlWithAnchor(tocHtml, element) {
  return tocHtml.replace(
    "</ol>",
    `<li><a href="#${element.id}">${element.textContent}</a></li></ol>`,
  );
}

// Register the extension.
showdown.extension("toc", toc);
