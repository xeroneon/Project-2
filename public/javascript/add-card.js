$("#search-card").on("click", function () {
    event.preventDefault();

    console.log("clicked")

    const newCard = {
        cardName: $("#search-val").val().trim()
    }

    $.ajax("/api/search-card", {
        type: "POST",
        //user the new user object and send it to the route
        data: newCard
    }).then(function (res) {
        console.log(res[0])

        var cardImage = $("<img>").attr("src", res[0].imageUrl);
        cardImage.attr("id", "card-image");


        cardName = $("<p>").append(res[0].name);
        cardName.attr("id", "card-name");

        manaCost = $("<p>").append("Mana Cost:" + res[0].manaCost);
        manaCost.attr("id", "mana-cost");

        cardDesc = $("<p>").append(res[0].text);
        cardDesc.attr("id", "card-desc");

        addCard = $("<a>").append("Add Card");
        addCard.attr("class", "waves-effect waves-green btn-flat");
        addCard.attr("id", "send-card");


        $(".modal-content").append(cardImage);
        $(".modal-content").append(cardName);
        $(".modal-content").append(manaCost);
        $(".modal-content").append(cardDesc);
        $(".modal-content").append(addCard);


    })
})

$("body").on("click", "#send-card", function () {
    console.log($("#card-name").text());

    const newCard = {
        cardName: $("#card-name").text()
    }

    $.ajax("/api/add-card", {
        type: "POST",
        //user the new user object and send it to the route
        data: newCard
    }).then(function (res) {
        console.log(res);


    })
})