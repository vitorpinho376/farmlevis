var $body = $('body');
var productsWrapper = document.getElementById('products');
var urlPrefix = window.location.port ? 'https://www.farmrio.com.br' : '';
var searchApiEndpoint = urlPrefix + '/api/catalog_system/pub/products/search';
var productsSearchQuery = '?fq=C:1&fq=specificationFilter_85:NOVIDADES&O=OrderByReleaseDateDESC&_from=0&_to=8';
var modalConfirmButtonColor = '#2d5f93';
var addToCartErrorModal = Swal.mixin({
    title: 'Houve um erro ao adicionar o produto',
    icon: 'error',
    confirmButtonText: 'ok',
    confirmButtonColor: modalConfirmButtonColor,
});

Number.prototype.formatMoney = function(c, d, t) {
    var n = this;
    c = isNaN((c = Math.abs(c))) ? 2 : c || 2;
    d = d || ',';
    t = t || ',';
    var s = n < 0 ? '-' : '';
    var i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + '';
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return (
        s +
        (j ? i.substr(0, j) + t : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
        (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '')
    );
};

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
            if (!sku || !sku.Tamanho || !sku.Tamanho[0]) return null;

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

        return 'R$ ' + price.formatMoney().replace(',00', '');
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
    $.ajax(searchApiEndpoint + productsSearchQuery, {
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
        var $this = $(event.currentTarget);
        
        try {
            if (!window.vtexjs) throw new Error('vtexjs is undefined');

            var $sizeSelected = $this.closest('.selection-card').find('input:checked');
            var itemObj = {
                id: $sizeSelected.val(),
                seller: $sizeSelected.data('seller-id'),
                quantity: 1
            };

            $this.text('adicionando...');
            vtexjs.checkout.addToCart([itemObj]).done(function() {
                $this.text('incluir na mochila');
                Swal.fire({
                    title: 'Produto adicionado com sucesso',
                    icon: 'success',
                    confirmButtonText: 'ir para a mochila',
                    confirmButtonColor: modalConfirmButtonColor,
                    showCancelButton: true,
                    cancelButtonText: 'continuar olhando'
                }).then(function(data) {
                    if (data.isConfirmed) window.location = '/checkout';
                });
            }).fail(function() {
                addToCartErrorModal.fire();
            });
        } catch (error) {
            console.error(`bindEvents -> error`, error);
            $this.text('incluir na mochila');
            addToCartErrorModal.fire();
        }
    });
}

$(function() {
    getProducts();
    bindEvents();
});
