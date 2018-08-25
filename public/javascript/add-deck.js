$("#add-deck").on("click", function () {
    event.preventDefault();

    console.log("clicked")

    const newDeck = {
        deck_name: $("#search-val").val().trim()
    }

    $.ajax("/api/decks", {
        type: "POST",
        //user the new user object and send it to the route
        data: newDeck
    }).then(function (res) {
        console.log(res[0]);
        window.location.reload();
    });
});


