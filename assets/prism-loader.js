(function () {
    var codeEls = $('pre > code[class*=lang-], pre > code[class*=language-]');

    if (codeEls.length) {
        //
        codeEls.each(function() {
            var pre = $(this).parent();
            pre.attr('class', pre.attr('class') + ' ' + $(this).attr('class'));
        });
        // insert js and css
        $('head').append('<link rel="stylesheet" href="/plugins/prism/assets/built/prism.css" type="text/css">');
        $('body').append('<script src="/plugins/prism/assets/built/prism.js"></script>');
    }
})()