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
        $("#modal-content").html(" ");
        

        for( let i = 0; i < res.length; i++) {
            cardImage = $("<img>").attr("src", res[i].cardImage);
            cardImage.attr("id", "card-image");
    
    
            cardName = $("<p>").append(res[i].cardName);
            cardName.attr("id", "card-name");
    
            manaCost = $("<p>").append("Mana Cost:" + res[i].cardMana);
            manaCost.attr("id", "mana-cost");
    
            cardDesc = $("<p>").append(res[i].cardText);
            cardDesc.attr("id", "card-desc");
    
            addCard = $("<a>").append("Add Card");
            addCard.attr("class", "waves-effect waves-green btn-flat white-text");
            addCard.attr("id", "send-card");
            addCard.attr("data-id", res[i].cardID);
            addCard.attr("data-name", res[i].cardName);
            addCard.attr("data-text", res[i].cardText);
            addCard.attr("data-set", res[i].cardSet);
            addCard.attr("data-rarity", res[i].cardRarity);
            addCard.attr("data-mana", res[i].cardMana);
            addCard.attr("data-image", res[i].cardImage);
            addCard.attr("data-artist", res[i].cardArtist);

            col = $("<div>").attr("class", "col s4 modal-card-con");
    
    
            col.append(cardImage);
            col.append(cardName);
            col.append(manaCost);
            col.append(cardDesc);
            col.append(addCard);

            $("#modal-content").append(col);
        }

        // var cardImage = $("<img>").attr("src", res[0].cardImage);
        // cardImage.attr("id", "card-image");


        // cardName = $("<p>").append(res[0].cardName);
        // cardName.attr("id", "card-name");

        // manaCost = $("<p>").append("Mana Cost:" + res[0].cardMana);
        // manaCost.attr("id", "mana-cost");

        // cardDesc = $("<p>").append(res[0].cardFlavor);
        // cardDesc.attr("id", "card-desc");

        // addCard = $("<a>").append("Add Card");
        // addCard.attr("class", "waves-effect waves-green btn-flat");
        // addCard.attr("id", "send-card");


        // $(".modal-content").append(cardImage);
        // $(".modal-content").append(cardName);
        // $(".modal-content").append(manaCost);
        // $(".modal-content").append(cardDesc);
        // $(".modal-content").append(addCard);


    })
})

$("body").on("click", "#send-card", function () {
    // console.log($("#card-name").text());
    console.log($(this).attr("data-name"))

    const newCard = {
        cardID: $(this).attr("data-id"),
        cardName: $(this).attr("data-name"),
        cardText: $(this).attr("data-text"),
        cardSet: $(this).attr("data-set"),
        cardRariy: $(this).attr("data-rarity"),
        cardMana: $(this).attr("data-mana"),
        cardImage: $(this).attr("data-image"),
        cardArtist: $(this).attr("data-artist")
    }

    $.ajax("/api/cards", {
        type: "POST",
        //user the new user object and send it to the route
        data: newCard
    }).then(function (res) {
        const data = {
            deck_id: $("#collection-id").attr("data-id"),
            card_id: newCard.cardID,
            card_quantity: 1
        }
        $.ajax("/api/decks/add-card", {
            type: "POST",
            data: data
        }).then(function(res) {
            console.log(res);
            window.location.reload();
        })

    })
});


$("body").on("click","#increase-card", function() {

    const newCard = {
        card_id: $(this).attr("data-card-id"),
        deck_id: $(this).attr("data-deck-id"),
        card_quantity: parseInt($(this).attr("data-quantity")) + 1
    }

    console.log(newCard.card_quantity);



    $.ajax("/api/decks/set-card", {
        type: "PUT",
        //user the new user object and send it to the route
        data: newCard
    }).then(function (res) {
        console.log(res);
        console.log("clicked")
        window.location.reload();
    })
})

$("body").on("click", "#decrease-card", function() {

    const newCard = {
        card_id: $(this).attr("data-card-id"),
        deck_id: $(this).attr("data-deck-id"),
        card_quantity: parseInt($(this).attr("data-quantity")) - 1
    }

    console.log(newCard.card_quantity);

    if(parseInt($(this).attr("data-quantity")) > 1) {
        $.ajax("/api/decks/set-card", {
            type: "PUT",
            //user the new user object and send it to the route
            data: newCard
        }).then(function (res) {
            console.log(res);
            console.log("clicked")
            window.location.reload();
        })
    } else {
        $.ajax("/api/decks/remove-card", {
            type: "DELETE",
            //user the new user object and send it to the route
            data: newCard
        }).then(function (res) {
            console.log(res);
            console.log("clicked")
            window.location.reload();
        })
    }

})