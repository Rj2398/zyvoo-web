// FILTERS-SECTION

// WHERE-SEARCH

$('#where-search').keyup(function () {
    var value = $(this).val().toLowerCase();
    $('.where-src-item').each(function () {
        var lcval = $(this).text().toLowerCase();
        if (lcval.indexOf(value) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});


$(document).ready(function () {
    $('#where-search').click(function () {
        $('.nav-inner-time-list').slideUp('fast');
        $('.nav-inner-activity-list').slideUp('fast');
        $('.nav-inner-where-list').slideToggle('fast');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.nav-inner-where-list').slideUp('fast');
    });
    $('.nav-inner-where-list').click(function () {
        event.stopPropagation();
    });
});

// WHERE-SEARCH

// TIME-SEARCH

// $(document).ready(function () {
//     $('#time-search').click(function () {
//         $('.nav-inner-where-list').slideUp('fast');
//         $('.nav-inner-activity-list').slideUp('fast');
//         $('.nav-inner-time-list').slideToggle('fast');
//         event.stopPropagation();
//     });
//     $(document).click(function () {
//         $('.nav-inner-time-list').slideUp('fast');
//     });
//     $('.nav-inner-time-list').click(function () {
//         event.stopPropagation();
//     });
// });

// $(function () {
//     $("#datepicker, #datepicker-2").datepicker({
//         showOtherMonths: true,
//         dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
//         minDate: new Date(),
//     });
// });

// // TIME-SEARCH


// // HOURS-SEARCH



// $("#slider").roundSlider({
//     sliderType: "min-range",
//     startAngle: 90,
//     value: 3,
//     lineCap: "round",
//     radius: 170,
//     width: 50,
//     handleSize: "40",

//     min: 0,
//     max: 12,

//     svgMode: true,
//     rangeColor: "#4AEAB1",
//     pathColor: "#ffffff",
//     borderWidth: 0,

//     tooltipFormat: function (e) {
//         return `
//         <div class="t-dotts">
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//         </div>
//         <div class="t-shape"></div>
//         <div class="t-value">${e.value}</div>
//         <div class="t-label">Hours</div>
//           `;
//     }
// });

// HOURS-SEARCH

// ACTIVITY-SEARCH

$('#activity-search').keyup(function () {
    var value = $(this).val().toLowerCase();
    $('.activity-src-item').each(function () {
        var lcval = $(this).text().toLowerCase();
        if (lcval.indexOf(value) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});


$(document).ready(function () {
    $('#activity-search').click(function () {
        $('.nav-inner-where-list').slideUp('fast');
        $('.nav-inner-time-list').slideUp('fast');
        $('.nav-inner-activity-list').slideToggle('fast');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.nav-inner-activity-list').slideUp('fast');
    });
    $('.nav-inner-activity-list').click(function () {
        event.stopPropagation();
    });
});

// ACTIVITY-SEARCH

// FILTERS-SECTION

// LOCATION-GRID-&-MAP-SECTION

$(document).ready(function () {
    $('.carousel-inner-top-heart').click(function () {
        $(".carousel-inner-top-heart img").not($(this).parent().find(".carousel-inner-top-heart img").toggleClass('active'));
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // SELECT ALL CAROUSELS
    var carousels = document.querySelectorAll('.location-grid-item .carousel');

    carousels.forEach(function (carousel) {
        var prevBtn = carousel.querySelector('.carousel-control-prev');
        var nextBtn = carousel.querySelector('.carousel-control-next');
        var items = carousel.querySelectorAll('.carousel-item');

        // HIDE OR SHOW ARROWS BASED ON ACTIVE SLIDE
        function updateArrows() {
            var activeItem = carousel.querySelector('.carousel-item.active');
            var activeIndex = Array.from(items).indexOf(activeItem);

            if (activeIndex === 0) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
            }

            if (activeIndex === items.length - 1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }

        // INITIAL ARROW UPDATE
        updateArrows();

        // LISTEN FOR CAROUSEL SLIDE EVENTS
        carousel.addEventListener('slid.bs.carousel', updateArrows);
    });
});

$(document).ready(function () {
    $('.top-filter-inner-btns a.active').click(function () {
        $('.location-grid-wrap').toggleClass('active');
        $('.location-map-wrap').toggleClass('show');
        $('.location-grid-map-in').toggleClass('separator');
    });
});



// LOCATION-GRID-&-MAP-SECTION


// COUNTRY-CODE-WITH-FLAG

$("#mobile_code, #mobile_code-2, #mobile_code-3").intlTelInput({
    initialCountry: "us",
    countrySearch: true,
    separateDialCode: true,
});


// COUNTRY-CODE-WITH-FLAG

// OTP-VERIFICATION-CODE

$(".inputs").keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next('.inputs').focus();
    }
    if (this.value.length == 0)
        $(this).prev('.inputs').focus();
});
$(".inputs").keyup(function () {
    if (this.value.length == 1) {
        $(this).addClass('active');
    }
});

$(".inputs").keyup(function () {
    if (this.value.length == 0) {
        $(this).removeClass('active');
    }
});


// OTP-VERIFICATION-CODE


// PASSOWRD-HIDE-SHOW


$(function () {

    $('.eye').click(function () {
        if ($(this).hasClass('eye-close')) {
            $(this).removeClass('eye-close');
            $(this).addClass('eye-open');
            $(this).parent().parent().find('.password').attr('type', 'text');
        } else {
            $(this).removeClass('eye-open');
            $(this).addClass('eye-close');
            $(this).parent().parent().find('.password').attr('type', 'password');
        }
    });
});

// PASSOWRD-HIDE-SHOW



// TIMER-COUNTDOWN

$(function () {
    jQuery.fn.extend({
        countdown: function (hour, min, sec) {
            const $this = $(this);
            const timerId = $this.attr('id'); // Get the ID of the current countdown

            // Calculate the end time based on the provided countdown duration
            const endTime = Date.now() + (hour * 3600 + min * 60 + sec) * 1000;
            localStorage.setItem('countdownEndTime_' + timerId, endTime); // Store end time per countdown

            const timer = setInterval(() => {
                const remainingTime = endTime - Date.now();

                if (remainingTime <= 0) {
                    clearInterval(timer);
                    localStorage.removeItem('countdownEndTime_' + timerId); // Remove only this countdown's end time
                    render($this, 0, 0, 0);
                    return;
                }

                const totalSeconds = Math.floor(remainingTime / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                render($this, hours, minutes, seconds);
            }, 1000);

            // Store timer reference for potential future use
            $this.data('timer', timer);
        },
    });

    // Initialize countdown with saved end time or default to 24 hours
    function initializeCountdown($element) {
        const timerId = $element.attr('id');
        const savedEndTime = localStorage.getItem('countdownEndTime_' + timerId);
        let hour, min, sec;

        if (savedEndTime) {
            const remainingTime = parseInt(savedEndTime) - Date.now();
            if (remainingTime > 0) {
                const totalSeconds = Math.floor(remainingTime / 1000);
                hour = Math.floor(totalSeconds / 3600);
                min = Math.floor((totalSeconds % 3600) / 60);
                sec = totalSeconds % 60;
            } else {
                hour = 0;
                min = 0;
                sec = 0;
            }
        } else {
            hour = 24;
            min = 0;
            sec = 0;
        }

        $element.countdown(hour, min, sec);
    }

    // Function to set a custom time for the countdown
    window.setCustomCountdownTime = function (timerId, inputHour, inputMin, inputSec) {
        const $countdown = $('#' + timerId);
        const hour = parseInt(inputHour) || 0;
        const min = parseInt(inputMin) || 0;
        const sec = parseInt(inputSec) || 0;

        // Validate time values
        if (hour < 0 || min < 0 || sec < 0 || min > 59 || sec > 59) {
            console.error('Invalid time values. Please enter valid hours, minutes, and seconds.');
            return;
        }

        // Stop the current timer if running
        clearInterval($countdown.data('timer'));

        // Start the new countdown with the input values
        $countdown.countdown(hour, min, sec);
    };

    // Initialize all countdowns
    $('.countdown').each(function () {
        initializeCountdown($(this));
    });

    // Example usage of setting custom time for a specific countdown
    setCustomCountdownTime('countdown1', 1, 30, 45);
    // Sets countdown1 to 3 hours, 42 minutes, and 6 seconds
    setCustomCountdownTime('countdown2', 1, 30, 45);
    // Sets countdown2 to 1 hour, 30 minutes, and 45 seconds
});

function render($element, hour, min, sec) {
    hour = ("00" + hour).slice(-2);
    min = ("00" + min).slice(-2);
    sec = ("00" + sec).slice(-2);

    $element.find('.hours').text(hour);
    $element.find('.minutes').text(min);
    $element.find('.seconds').text(sec);
}

// TIMER-COUNTDOWN

// NAV-USER-PROFILE

$(document).ready(function () {
    $('.nav-account-in-profile').click(function () {
        $('.nav-account-in-list').slideToggle('fast');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.nav-account-in-list').slideUp('fast');
        event.stopPropagation();
    });
    $('.nav-account-in-list').click(function () {
        event.stopPropagation();
    });
});

// NAV-USER-PROFILE


// COMPLETE-YOUR-PROFILE

$(document).ready(function () {
    $('.user-data-list-item input').click(function () {
        $(".user-data-list-dropdown").not($(this).parent().find(".user-data-list-dropdown").slideToggle()).slideUp();
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.user-data-list-dropdown').slideUp('fast');
    });
    $('.user-data-list-dropdown').click(function () {
        event.stopPropagation();
    });
});

$(document).ready(function () {
    $('.user-profile-upload-name h2 button').click(function () {
        $('span.user-name-dropdown').slideToggle('fast');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('span.user-name-dropdown').slideUp('fast');
        event.stopPropagation();
    });
    $('span.user-name-dropdown').click(function () {
        event.stopPropagation();
    });
});

// COMPLETE-YOUR-PROFILE


// MOBILE-NAV

$(document).ready(function () {
    $('nav button.navbar-toggler').click(function () {
        $('nav button.navbar-toggler span').toggleClass('cross');
    });
});

// MOBILE-NAV


// FILTER-POPUP

(function () {

    var parent = document.querySelector(".price-in");
    if (!parent) return;

    var
        rangeS = parent.querySelectorAll("input[type=range]"),
        numberS = parent.querySelectorAll("input[type=number]");

    rangeS.forEach(function (el) {
        el.oninput = function () {
            var slide1 = parseFloat(rangeS[0].value),
                slide2 = parseFloat(rangeS[1].value);

            if (slide1 > slide2) {
                [slide1, slide2] = [slide2, slide1];
            }

            numberS[0].value = slide1;
            numberS[1].value = slide2;
        }
    });

    numberS.forEach(function (el) {
        el.oninput = function () {
            var number1 = parseFloat(numberS[0].value),
                number2 = parseFloat(numberS[1].value);

            if (number1 > number2) {
                var tmp = number1;
                numberS[0].value = number2;
                numberS[1].value = tmp;
            }

            rangeS[0].value = number1;
            rangeS[1].value = number2;

        }
    });

})();


$(document).ready(function () {
    $('.activities-wrap button').click(function () {
        $(this).toggleClass('active');
        $('.activities-in').toggleClass('active');
    });
});

$(document).ready(function () {
    $('.amenities-wrap button').click(function () {
        $(this).toggleClass('active');
        $('.amenities-wrap label').toggleClass('active');
    });

    $('.amenities-wrap button').click(function () {
        if ($(this).hasClass('active')) {
            $(".amenities-wrap button").text('Show Less');
        }
        else {
            $(".amenities-wrap button").text('Show More');
        }
    });
});


$(document).ready(function () {
    $('.language-wrap button').click(function () {
        $(this).toggleClass('active');
        $('.language-wrap label').toggleClass('active');
    });

    $('.language-wrap button').click(function () {
        if ($(this).hasClass('active')) {
            $(".language-wrap button").text('Show Less');
        }
        else {
            $(".language-wrap button").text('Show More');
        }
    });
});

$(document).ready(function () {
    $('.time-button').click(function () {
        $('.time-in').toggleClass('active');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.time-in').removeClass('active');
        event.stopPropagation();
    });
    $('.time-in').click(function () {
        event.stopPropagation();
    });
});


$(document).ready(function () {
    $('.location-date-btn').click(function () {
        $(".location-date-list").not($(this).parent().find(".location-date-list").slideToggle()).slideUp();
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.location-date-list').slideUp('fast');
        event.stopPropagation();
    });
    $('.location-date-list').click(function () {
        event.stopPropagation();
    });
});

// FILTER-POPUP


// EXPLORE-GUIDES-ARTICLES

$(document).ready(function () {
    $(".explore-guides-articles-inner .col-lg-3").each(function (index) {
        if ((index + 1) % 4 === 0) {
            $('<div class="col-lg-12"><hr class="line" /></div>').insertAfter($(this));
        }
    });
});

// EXPLORE-GUIDES-ARTICLES

// PAYMENT-METHOD

$(document).ready(function () {
    $('.payment-method span').click(function () {
        $(this).toggleClass('active');
        $('.add-card-details').removeClass('active');
        $('.saved-cards').slideToggle('fast');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.payment-method span').removeClass('active');
        $('.saved-cards').slideUp('fast');
        event.stopPropagation();
    });
    $('.saved-cards').click(function () {
        event.stopPropagation();
    });
});

$(document).ready(function () {
    $('.add-card').click(function () {
        $('.saved-cards').slideUp('fast');
        $('.add-card-details').toggleClass('active');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.add-card-details').removeClass('active');
        event.stopPropagation();
    });
    $('.add-card-details').click(function () {
        event.stopPropagation();
    });
});

$(document).ready(function () {
    $('.card-control-btn i').click(function () {
        $(".card-control-dropdown").not($(this).parent().parent().find(".card-control-dropdown").toggleClass('active')).removeClass('active');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.card-control-dropdown').removeClass('active');
        event.stopPropagation();
    });
    $('.card-control-dropdown').click(function () {
        event.stopPropagation();
    });
});

// PAYMENT-METHOD


// LOCATION-PAGE

$(document).ready(function () {
    $('.location-about a').click(function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).text('Show Less');
        } else {
            $(this).text('Read more');
        }
        $('.location-about p').toggleClass('active');
    });
});

$(document).ready(function () {
    $('.location-addons a').click(function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).text('Show Less');
        } else {
            $(this).text('Show more');
        }
        $('.location-hidden-addons').slideToggle('fast');
    });
});

// LOCATION-PAGE