function metaTagsHandler() {
    try {
        $('meta[data-tag]').each(function(_, meta) {
            var $meta = $(meta);
            var metaTag = $meta.attr('data-tag');
            var metaAttribute = $meta.attr('data-attribute');
            var metaType = $meta.attr('data-type');
            var metaValueAttribute = $meta.attr('data-value-attribute');
            var metaValue = $meta.attr('data-value');
    
            if (metaTag === 'title') document.title = metaValue;
            else {
                if ($(metaTag + '[' + metaAttribute + '="' + metaType + '"]').length) {
                    $(metaTag + '[' + metaAttribute + '="' + metaType + '"]').attr(metaValueAttribute, metaValue);
                } else {
                    $('head').append('<' + metaTag + ' ' + metaAttribute + '="' + metaType + '" ' + metaValueAttribute + '="' + metaValue + '" ' + '/>');
                }
            }
        });
    } catch (error) {
        console.log(`metaTagsHandler -> error`, error);
    }
}

$(function() {
    metaTagsHandler();
});
