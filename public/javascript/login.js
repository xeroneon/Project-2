$("#login").on("click", function() {
    event.preventDefault();
    //create a user object here from the form values
    const newUser = {
        user_name: $("#user_name").val().trim(),
        user_password: $("#user_password").val().trim()
    };
    //route to hit when a user logs in
    $.ajax("/api/login", {
        type: "POST",
        //user the new user object and send it to the route
        data: newUser
    }).then(function(req, res) {
        //if the response is authorized then redirect them to the dashboard page 
        if(req.Auth) {
            window.location.href = "/dashboard";
        } else {
            console.log("try again");
            M.toast({html: 'Something went wrong, try again'})
            //TODO => create logic here for if the response is false and let user know password is wrong
        }
    })
})