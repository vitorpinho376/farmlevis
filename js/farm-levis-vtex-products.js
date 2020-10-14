var $body = $('body');
var productsWrapper = document.getElementById('products');
var urlPrefix = window.location.port ? 'https://www.farmrio.com.br' : '';
var searchApiEndpoint = urlPrefix + '/api/catalog_system/pub/products/search';

function getAvailability(sku) {
    try {
        return !!sku.sellers[0].commertialOffer.AvailableQuantity;
    } catch (error) {
        console.error(`getAvailability -> error`, error);
        return false;
    }
}

function renderSizeSelector(skus, productId) {
    try {
        return skus.map(function(sku) {
            if (!sku || !sku.Tamanho[0]) return null;

            var size = sku.Tamanho[0];
            var available = getAvailability(sku);

            return '\
                <label class="btn btn-secondary ' + (available ? '' : 'unavailable') + '">\
                    <input class="size-radio" type="radio" name="size-' + productId + '" id="' + productId + '-' + size + '" value="' + sku.itemId + '" data-seller-id="' + sku.sellers[0].sellerId + '" ' + (available ? '' : 'disabled') + '>' +
                    size + '\
                </label>\
            ';
        }).filter(Boolean).join('');
    } catch (error) {
        console.error(`renderSizeSelector -> error`, error);
    }
}

function renderProductPrice(skus) {
    try {
        var price = skus.find(function(sku) {
            return sku.sellers[0].commertialOffer.AvailableQuantity;
        }).sellers[0].commertialOffer.Price;

        return 'R$ ' + price.toLocaleString('pt-BR');
    } catch (error) {
        console.error(`renderProductPrice -> error`, error);
    }
}

function renderProduct(product) {
    try {
        var isAvailable = product.items.some(function(sku) {
            return sku.sellers[0].commertialOffer.AvailableQuantity;
        });
        var productMarkup = '';
        var productName = product.productName;
        var productImage = product.items[0].images.find(function(image) {
            return image.imageLabel === '1';
        }).imageUrl.replace(/(?:ids\/)(\d+)((-\d+){2})?/g, 'ids/$1-528-792');

        if (isAvailable) {
            productMarkup = '\
                <div class="shopping-item" data-aos="fade-up" data-product-id="' + product.productId + '">\
                    <div class="image-holder">\
                        <img src="' + productImage + '" width="528" height="792" alt="' + productName + '" />\
                    </div>\
                    <div class="selection-card">\
                        <h4 class="item-title">' + productName + '</h4>\
                        <span class="price">' + renderProductPrice(product.items) + '</span>\
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">' +
                            renderSizeSelector(product.items, product.productId) + '\
                        </div>\
                        <div class="action-holder">\
                            <button class="btn btn-secondary" disabled>selecione o tamanho</button>\
                        </div>\
                    </div>\
                </div>\
            ';
        } else {
            productMarkup = '\
                <div class="shopping-item" data-aos="fade-up" data-product-id="' + product.productId + '">\
                    <div class="image-holder">\
                        <img src="' + productImage + '" width="528" height="792" alt="' + productName + '" />\
                    </div>\
                    <div class="selection-card">\
                        <h4 class="item-title">' + productName + '</h4>\
                        <span class="price">Indisponível</span>\
                    </div>\
                </div>\
            ';
        }

        $(productsWrapper).find('.comm-grid').append(productMarkup);
    } catch (error) {
        console.log(`renderProduct -> error`, error);
    }
}

function renderProducts(products) {
    try {
        products.forEach(renderProduct);
        AOS.init();
    } catch (error) {
        console.error(`renderProducts -> error`, error);
    }
}

function getProducts() {
    // query provisória
    $.ajax(searchApiEndpoint + '?_from=0&_to=8', {
        success: renderProducts,
        error: console.error
    });
}

function bindEvents() {
    // sku selector
    $body.on('change', '.size-radio', function(event) {
        var $this = $(event.currentTarget);
        var $parent = $this.parent();
        var $uncles = $parent.siblings();
        var $buyButton = $this.closest('.selection-card').find('.action-holder').children('.btn');

        $uncles.removeClass('active');
        $parent.addClass('active');
        $buyButton.attr('disabled', false).text('incluir na mochila');
    });

    // add to cart
    $body.on('click', '.selection-card .action-holder .btn', function(event) {
        try {
            if (!window.vtexjs) return;

            var $this = $(event.currentTarget);
            var $sizeSelected = $this.closest('.selection-card').find('input:checked');
            var itemObj = {
                id: $sizeSelected.val(),
                seller: $sizeSelected.data('seller-id'),
                quantity: 1
            };

            $this.text('adicionando...');
            vtexjs.checkout.addToCart([itemObj]).done(function(orderForm) {
                $this.text('incluir na mochila');
            });
        } catch (error) {
            console.error(`bindEvents -> error`, error);
        }
    });
}

$(function() {
    getProducts();
    bindEvents();
});
