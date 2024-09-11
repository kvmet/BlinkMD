{
  addEventListener("load", (event) => {
    const regex = /[^\w-\d()/]/g; // Regex to clean url query
    sitePath = "/../site/"; // Relative to the location of your index.html

    // TODO: import header and footer files?

    // TODO: strip key-value pairs? media format types?
    path = window.location.search.replace(regex,"");

    if(path.length <= 1) {
      path = "index.md";
    } else {
      path += ".md";
    }
    if(sitePath[0] == `/`) {
      path = window.location.protocol + `//` + window.location.pathname + sitePath + path;
    } else {
      path = sitePath + path;
    }

    const el = document.querySelector("content");

    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
      })
      .then((markdown) => {
        var converter = new showdown.Converter({metadata:true});
        var html = converter.makeHtml(markdown);

        console.log(converter.getMetadata());

        el.innerHTML = converter.makeHtml(markdown);

        //el.replaceChildren(converter.makeHtml(markdown));
      })
      .catch((error) => {
        el.replaceChildren(`Failed to load : ${error}`);
    });
    
  });
}
