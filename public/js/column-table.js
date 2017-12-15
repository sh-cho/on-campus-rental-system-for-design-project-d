$('.cell[data-colspan]').each(function() {
    $(this).css('height', Number($(this).attr('data-colspan'))*30 + "px");
});