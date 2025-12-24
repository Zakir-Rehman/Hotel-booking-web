$(document).ready(function () {
    // Bootstrap validation (converted to jQuery)
    (function () {
        'use strict';

        const forms = $('.needs-validation');

        forms.each(function () {
            $(this).on('submit', function (event) {
                if (!this.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                $(this).addClass('was-validated');
            });
        });
    })();

    // GSAP animation
    function indexEJS() {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(".images-db",
            {
                filter: "blur(20px)"
            },
            {
                filter: "blur(0px)",
                stagger: 0.3
            }
        );
    }
    indexEJS();

    // FAB button panel toggle (converted to jQuery)
    $('.fab-btn').on('click', function () {
        $('.fab-panel').toggleClass('show');
    });

    // Online/offline status (converted to jQuery)
    function updateOnlineStatus() {
        const offlineMsg = $("#offlineMessage");

        if (!navigator.onLine) {
            offlineMsg.removeClass("hidden").addClass("animate-slide-down");
        } else {
            offlineMsg.addClass("hidden");
        }
    }

    $(window).on("online offline", updateOnlineStatus);

    // Page load check
    updateOnlineStatus();

})