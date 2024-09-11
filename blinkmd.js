{
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

  addEventListener(`load`, (event) => {
    const regex = /[^\w-\d()/]/g; // Regex to clean url query
    sitePath = `./site/`; // Start with ./ to make it relative to index.html directory
    headerFile = null; // TODO
    footerFile = null; // TODO

    // TODO: strip key-value pairs? media format types?
    path = window.location.search.replace(/\./g,`/`).replace(regex,``);

    if(path.length <= 1) {
      path = "index.md";
    } else {
      path += ".md";
    }

    const el = document.querySelector("content");

    fetch(sitePath + path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
      })
      .then((markdown) => {
        var converter = new showdown.Converter({
          metadata:true,
          extensions: [
            showdownKatex({}),
          ],
        });
        var html = converter.makeHtml(markdown);
        mermaid.initialize({ startOnLoad: true });

        console.log(converter.getMetadata());

        //TODO: I suspect this is double-parsing because makeHtml returns a string. could maybe be more performant?
        el.innerHTML = converter.makeHtml(markdown);
      })
      .catch((error) => {
        el.replaceChildren(`Failed to load : ${error}`);
    });
    
  });
}
