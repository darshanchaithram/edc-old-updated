jQuery(window).on( "load", function(){

    var $container = $("#posts");

    $container.isotope({
        itemSelector: ".entry",
        masonry: {
            columnWidth: ".entry:not(.entry-date-section)"
        }
    });

    $container.infiniteScroll({
        path: ".load-next-posts",
        button: ".load-next-posts",
        scrollThreshold: false,
        history: false,
        status: ".page-load-status"
    });

    $container.on( "load.infiniteScroll", function( event, response, path ) {
        var $items = $( response ).find(".entry");
        // append items after images loaded
        $items.imagesLoaded( function() {
            $container.append( $items );
            $container.isotope( "insert", $items );
            setTimeout( function(){
                $container.isotope("layout");
                SEMICOLON.initialize.resizeVideos();
                SEMICOLON.widget.loadFlexSlider();
                SEMICOLON.widget.masonryThumbs();
            }, 1000 );
            setTimeout( function(){
                SEMICOLON.initialize.blogTimelineEntries();
            }, 1500 );
        });
    });

    setTimeout( function(){
        SEMICOLON.initialize.blogTimelineEntries();
    }, 2500 );

    $(window).resize(function() {
        $container.isotope("layout");
        setTimeout( function(){
            SEMICOLON.initialize.blogTimelineEntries();
        }, 2500 );
    });

});
