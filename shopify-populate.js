
(function () {
  const Config = {
    shopDomain: "YOUR_SHOP_NAME.myshopify.com",
    storefrontToken: "YOUR_STOREFRONT_ACCESS_TOKEN",
    apiVersion: "2024-04",
    defaultPageSize: 24
  };

  const endpoint = `https://${Config.shopDomain}/api/${Config.apiVersion}/graphql.json`;

  function variantGidToNumeric(gid) {
    const m = String(gid).match(/ProductVariant\/(\d+)/);
    return m ? m[1] : null;
  }

  async function gql(query, variables = {}) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": Config.storefrontToken
      },
      body: JSON.stringify({ query, variables })
    });
    if (!res.ok) throw new Error("Shopify error: " + res.status);
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    return json.data;
  }

  const Q = {
    collectionProducts: `
      query CollectionProducts($handle: String!, $first: Int!, $after: String) {
        collection(handle: $handle) {
          products(first: $first, after: $after) {
            pageInfo { hasNextPage endCursor }
            edges {
              node {
                id
                handle
                title
                description
                images(first: 1) { edges { node { url altText } } }
                priceRange { minVariantPrice { amount currencyCode } }
                variants(first: 1) { edges { node { id } } }
              }
            }
          }
        }
      }
    `
  };

  function setText(el, text) { if (el) el.textContent = text ?? ""; }
  function setHTML(el, html) { if (el) el.innerHTML = html ?? ""; }
  function setImage(el, url, alt) { if (el) { el.src = url || ""; if (alt) el.alt = alt; } }
  function setHref(el, url) { if (el) el.href = url || "#"; }

  function bindProduct(templateEl, product) {
    const root = templateEl.cloneNode(true);
    root.removeAttribute("data-product-template");

    const imageNode = product.images?.edges?.[0]?.node;
    const price = product.priceRange?.minVariantPrice;
    const variant = product.variants?.edges?.[0]?.node;

    root.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      switch (key) {
        case "title":
          setText(el, product.title);
          break;
        case "description":
          setText(el, product.description);
          break;
        case "price":
          if (price?.amount && price?.currencyCode) {
            const amt = Number(price.amount);
            setText(el, new Intl.NumberFormat(undefined, { style: "currency", currency: price.currencyCode }).format(amt));
          }
          break;
        case "image":
          setImage(el, imageNode?.url, imageNode?.altText || product.title);
          break;
        case "addToCartUrl":
          if (variant?.id) {
            const numeric = variantGidToNumeric(variant.id);
            if (numeric) setHref(el, `https://${Config.shopDomain}/cart/${numeric}:1`);
          }
          break;
      }
    });

    return root;
  }

  async function renderCollectionGrid(section) {
    const handle = section.getAttribute("data-shopify-collection");
    if (!handle) return;
    const template = section.querySelector("[data-product-template]");
    if (!template) return;

    let after = null;
    let loading = false;

    async function loadMore(first = Config.defaultPageSize) {
      if (loading) return; loading = true;
      const data = await gql(Q.collectionProducts, { handle, first, after });
      const conn = data?.collection?.products;
      if (!conn) return;

      conn.edges.forEach(({ node }) => {
        const card = bindProduct(template, node);
        section.appendChild(card);
      });

      template.style.display = "none";
      after = conn.pageInfo?.endCursor || null;
      const btn = document.querySelector("[data-load-more]");
      if (btn) btn.disabled = !conn.pageInfo?.hasNextPage;
      loading = false;
    }

    await loadMore();
    const btn = document.querySelector("[data-load-more]");
    if (btn) btn.addEventListener("click", () => loadMore());
  }

  function boot() {
    document.querySelectorAll("[data-shopify-collection]").forEach(renderCollectionGrid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
