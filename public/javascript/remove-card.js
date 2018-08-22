$("body").on("click", "#remove-card", function() {
    console.log($(this).attr("data-id"));
    let cardId = $(this).attr("data-id");

    $.ajax("/api/remove-card/" + cardId, {
        type: "POST",
    }).then(function (res) {
        // window.location.href = "/dashboard";
        window.location.reload();
    })
})