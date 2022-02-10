window.onload = function () {
  const input = document.getElementById("main-input");
  const buttons = document.getElementsByClassName("payback-buttons");
  const resultColumn = document.getElementById("right-column-result");
  const onlineShops = document.getElementById("online-shops");
  const products = document.getElementById("products");
  const onBackend = document.getElementById("on-backend");
  const onPayback = document.getElementById("on-payback");
  const resultContainer = document.getElementsByClassName("result-container");

  let searchTarget = 0;

  input.addEventListener("keyup", function () {
    if (window.innerWidth < 1000) {
      return;
    }

    if (searchTarget == 1) {
      fetchPaybackDataD(input);
    } else {
      fetchBackendDataD(input);
    }
  });

  onBackend.addEventListener("click", function () {
    input.placeholder = "Searching cars...";
    searchTarget = 0;
  });

  onPayback.addEventListener("click", function () {
    input.placeholder = "Searching Payback...";
    searchTarget = 1;
  });

  input.addEventListener("click", function () {
    for (var i = 0; i < buttons.length; ++i) {
      buttons[i].classList.add("display-none");
    }
    resultContainer[0].classList.remove("display-none");
  });

  input.addEventListener("blur", function () {
    setTimeout(function () {
      makeButtonsVisible(buttons);
    }, 100);
    resultContainer[0].classList.add("display-none");
  });

  async function fetchPaybackDataD(input) {
    let searchTerm = input.value;

    if (searchTerm.length < 2) return;
    const response = fetchPaybackData(input);
    const data = await response;
    populatePaybackData(data);
  }

  async function fetchBackendDataD(input) {
    let searchTerm = input.value;

    if (searchTerm.length < 2) return;
    const response = fetchBackendData(input);
    const data = await response;

    resultColumn.innerHTML = "";
    products.innerHTML = "";
    onlineShops.innerHTML = "";

    data.forEach(function (item) {
      resultColumn.insertAdjacentHTML(
        "beforeEnd",
        returnBackendHtmlAsString(item)
      );
    });
  }

  //example of arrow func
  const populatePaybackData = (data) => {
    resultColumn.innerHTML = "";
    products.innerHTML = "";
    onlineShops.innerHTML = "";
    data.typeaheadJts.items.forEach(function (item) {
      resultColumn.insertAdjacentHTML("beforeEnd", returnHtmlAsString(item));
      onlineShops.insertAdjacentHTML(
        "beforeEnd",
        `<div><a href="https://payback.de${item.url}">${item.title}</a></div>`
      );
    });

    data.typeaheadRewards.items.forEach(function (item) {
      resultColumn.insertAdjacentHTML(
        "beforeEnd",
        returnHtmlAsStringProduct(item)
      );
      products.insertAdjacentHTML(
        "beforeEnd",
        `<div><a href="https://payback.de${item.url}">${item.title}</a></div>`
      );
    });
  };
};

function makeButtonsVisible(buttons) {
  for (var i = 0; i < buttons.length; ++i) {
    buttons[i].classList.remove("display-none");
  }
}

function returnHtmlAsString(item) {
  return `
  <a target="_blank" href="https://payback.de${item.url}">
  <div class="individual-item">
  <div class="image-holder">
    <img src="${item.galleryUrl}" alt="">
  </div>
  <hr>
  <div class="title">${item.title}</div>
  <div class="points">
  ${item.incentivationText}
  </div>
</div>
</a>
`;
}

function returnHtmlAsStringProduct(item) {
  return `
  <a target="_blank" href="https://payback.de${item.url}">
  <div class="individual-item">
  <div class="item-discount">
  ${item.badgeLabel}
  </div>
  <div class="image-holder">
    <img src="${item.galleryUrl}" alt="">
  </div>
  <hr>
  <div class="title">${item.title}</div>
  <div class="points">
  ${item.priceFormatted}
  </div>
</div>
</a>
`;
}

function returnBackendHtmlAsString(item) {
  return `
  <div class="individual-item">
  <div class="item-discount">
  ${item.horsepower}hp
  </div>
  <div class="image-holder">
    <img src="${item.img_url}" alt="">
  </div>
  <hr>
  <div class="title">${item.make}</div>
  <div class="points">
  ${item.model}
  </div>
</div>
`;
}

async function fetchBackendData(input) {
  let searchTerm = input.value;

  const response = await fetch(
    `https://56f6-37-205-26-5.ngrok.io/index.php/demo/list/${searchTerm}`,
    {
      headers: {
        origin: "x-requested-with",
      },
    }
  );
  const data = response.json();
  return data;
}

async function fetchPaybackData(input) {
  let searchTerm = input.value;

  if (searchTerm.length < 2) return;
  const response = await fetch(
    `https://secret-ocean-49799.herokuapp.com/https://www.payback.de/ajax/productsearch?searchterm=%7B%22pageNumber%22%3A1%2C%22query%22%3A%5B%22${searchTerm}%22%5D%7D&searchProvider=typeaheadJts%2CtypeaheadRewards&content_id=`,
    {
      headers: {
        origin: "x-requested-with",
      },
    }
  );
  const data = await response.json();
  return data;
}

module.exports = { fetchBackendData, fetchPaybackData };
