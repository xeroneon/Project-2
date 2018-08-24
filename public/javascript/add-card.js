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

        for( let i = 0; i < res.length; i++) {
            var cardImage = $("<img>").attr("src", res[0].cardImage);
            cardImage.attr("id", "card-image");
    
    
            cardName = $("<p>").append(res[0].cardName);
            cardName.attr("id", "card-name");
    
            manaCost = $("<p>").append("Mana Cost:" + res[0].cardMana);
            manaCost.attr("id", "mana-cost");
    
            cardDesc = $("<p>").append(res[0].cardFlavor);
            cardDesc.attr("id", "card-desc");
    
            addCard = $("<a>").append("Add Card");
            addCard.attr("class", "waves-effect waves-green btn-flat");
            addCard.attr("id", "send-card");

            col = $("<div>").attr("class", "col s3");
    
    
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
        window.location.reload();

    })
})