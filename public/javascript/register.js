$("#submit").on("click", function() {
    event.preventDefault();
    //create user object here to send to a database call
    const newUser = {
        user_email: $("#email").val().trim(),
        user_password: $("#password").val().trim(),
        user_name: $("#username").val().trim(),
        user_first_name: $("#first_name").val().trim() ,
        user_last_name: $("#last_name").val().trim()
    };

    $.ajax("/api/users", {
        type: "POST",
        //send the newUser object along with the ajax call
        data: newUser
    }).then(function() {
        console.log("created new user");
        //TODO => reroute user to login page after they have signed up
        location.reload;
    })
})