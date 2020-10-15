var $cartButton = $('.cart-button');
var $cartButtonItemsCount = $cartButton.children('.cart-button__count');
var $stickedMenu = $('div.sticked-menu');

function renderItemsCount(orderForm) {
    try {
        var quantity = orderForm.items.reduce(function(current, next) {
            return current + (next.quantity || 0);
        }, 0);

        $cartButtonItemsCount.text(quantity);
        $cartButton.toggleClass('is-hidden', !$stickedMenu.hasClass('dropout'));
    } catch (error) {
        console.error('renderItemsCount -> error', error);
    }
}

$(function() {
    if (!window.vtexjs) return;
    
    $(window).on('orderFormUpdated.vtex', function(_, orderForm) {
        renderItemsCount(orderForm);
    });

    vtexjs.checkout.getOrderForm([items]);
});
