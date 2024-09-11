{
  addEventListener(`load`, (event) => {
    const regex = /[^\w-\d()/]/g; // Regex to clean url query
    sitePath = `./site/`; // Start with ./ to make it relative to index.html directory
    headerFile = null; // TODO
    footerFile = null; // TODO

    //baseurl = window.location.pathname;
    //baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf(`/`)) + sitePath;
    //baseUrl = window.location.protocol + `/` + window.location.host + `/` + baseUrl;
//
    //if (sitePath[0] == `/`) {
      //baseUrl = window.location.href;
      //sitePath = baseUrl.substring(0, baseUrl.lastIndexOf(`/`)) + sitePath;
    //}
    //if (sitePath[sitePath.length-1] != `/`) {
      //sitePath += `/`;
    //}

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
        var converter = new showdown.Converter({metadata:true});
        var html = converter.makeHtml(markdown);

        console.log(converter.getMetadata());

        //TODO: I suspect this is double-parsing because makeHtml returns a string. could maybe be more performant?
        el.innerHTML = converter.makeHtml(markdown);
      })
      .catch((error) => {
        el.replaceChildren(`Failed to load : ${error}`);
    });
    
  });
}
