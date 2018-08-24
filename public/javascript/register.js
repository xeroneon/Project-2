$("#register").on("click", function() {
    event.preventDefault();
    //create user object here to send to a database call
    const newUser = {
        user_email: $("#register_email").val().trim(),
        user_password: $("#register_password").val().trim(),
        user_name: $("#register_user_name").val().trim(),
        user_first_name: $("#register_first_name").val().trim() ,
        user_last_name: $("#register_last_name").val().trim()
    };

    $.ajax("/api/register-user", {
        type: "POST",
        //send the newUser object along with the ajax call
        data: newUser
    }).then(function() {
        console.log("created new user");
        //TODO => reroute user to login page after they have signed up
        window.location.href = "/";
    })
})