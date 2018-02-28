/* global instantsearch */

app({
  appId: 'XLOY9IMVIL',
  apiKey: 'a41937a0ba110719e138fb7310279edc',
  indexName: '28feb',
  searchParameters: {
    hitsPerPage: 10,
  },
});

function app(opts) {
  // ---------------------
  //
  //  Init
  //
  // ---------------------
  const search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true,
    searchFunction: opts.searchFunction,
  });

  // ---------------------
  //
  //  Default widgets
  //
  // ---------------------
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Marka veya model adıyla bir araç ara',
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
      transformData: {
        item(item) {
          /* eslint-disable no-param-reassign */
          item.starsLayout = getStarsHTML(item.rating);
          item.categories = getCategoryBreadcrumb(item);
          return item;
        },
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats',
    })
  );

  search.addWidget(
    instantsearch.widgets.sortBySelector({
      container: '#sort-by',
      autoHideContainer: true,
      indices: [
        {
          name: opts.indexName,
          label: 'İlgiye göre',
        },
        {
          name: `${opts.indexName}_price_asc`,
          label: 'En düşük fiyat',
        },
        {
          name: `${opts.indexName}_price_desc`,
          label: 'En yüksek fiyat',
        },
      ],
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    })
  );

  // ---------------------
  //
  //  Filtering widgets
  //
  // ---------------------
search.addWidget(
    instantsearch.widgets.priceRanges({
      container: '#price-range',
      attributeName: 'IntPrice',
      labels: {
        currency: '₺',
        separator: '—',
        button: 'Filtrele',
      },
      templates: {
        header: getHeader('Fiyat Aralığı'),
      },
    })
  );
search.addWidget(
instantsearch.widgets.refinementList({
      container: '#hierarchical-categories',
      attributeName: 'Brand',
      limit: 10,
      showMore: {
        limit: 20,
      },
      templates: {
        header: getHeader('MARKA'),
      },
    })
  );
search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#brand',
      attributeName: 'Transmission',
      limit: 5,
      showMore: {
        limit: 10,
      },
      templates: {
        header: getHeader('Şanzıman'),
      },
    })
  );
search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#fuel',
      attributeName: 'Fuel',
      limit: 5,
      showMore: {
        limit: 10,
      },
      templates: {
        header: getHeader('YAKIT'),
      },
    })
);    

  search.addWidget(
    instantsearch.widgets.rangeSlider({
      container: '#price',
      attributeName: 'IntFuelConsumption',
      tooltips: {
        format(rawValue) {
          return `${Math.round(rawValue)}lt`;
        },
      },
      templates: {
        header: getHeader('Yakıt tüketimi'),
      },
      collapsible: {
        collapsed: false,
      },
    })
  );


  search.addWidget(
    instantsearch.widgets.menu({
      container: '#type',
      attributeName: 'Type',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 10,
      showMore: true,
      templates: {
        header: getHeader('Araç Tipi'),
      },
      collapsible: {
        collapsed: true,
      },
    })
  );


search.start();
};
/*
  search.addWidget(
    instantsearch.widgets.starRating({
      container: '#stars',
      attributeName: 'rating',
      max: 5,
      labels: {
        andUp: '& Up',
      },
      templates: {
        header: getHeader('Rating'),
      },
      collapsible: {
        collapsed: false,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.toggle({
      container: '#free-shipping',
      attributeName: 'free_shipping',
      label: 'Free Shipping',
      values: {
        on: true,
      },
      templates: {
        header: getHeader('Shipping'),
      },
      collapsible: {
        collapsed: true,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.menu({
      container: '#type',
      attributeName: 'Gearbox',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 10,
      showMore: true,
      templates: {
        header: getHeader('Vites'),
      },
    })
  );
*/   

// ---------------------
//
//  Helper functions
//
// ---------------------
function getTemplate(templateName) {
  return document.querySelector(`#${templateName}-template`).innerHTML;
}

function getHeader(title) {
  return `<h5>${title}</h5>`;
}

function getCategoryBreadcrumb(item) {
  const highlightValues = item._highlightResult.categories || [];
  return highlightValues.map(category => category.value).join(' > ');
}

function getStarsHTML(rating, maxRating) {
  let html = '';
  const newRating = maxRating || 5;

  for (let i = 0; i < newRating; ++i) {
    html += `<span class="ais-star-rating--star${
      i < rating ? '' : '__empty'
    }"></span>`;
  }

  return html;
}
