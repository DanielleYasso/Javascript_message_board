$(document).ready(function () 
{
    // Normally, JavaScript runs code at the time that the <script>
    // tags loads the JS. By putting this inside a jQuery $(document).ready()
    // function, this code only gets run when the document finishing loading.

    $("#message-form").submit(handleFormSubmit);
    getMessages();

    // Handle clicks on the Clear button to clear the messages
    $("#clearButton").click(
        function (evt)
        {
            $.get(
                "/api/wall/clear",
                function(result)
                {
                    displayMessages(result);
                    displayResultStatus(result.result, true);
                }
                
            );
        }
    );

});


/**
 * Handle submission of the form.
 */
function handleFormSubmit(evt) 
{
    evt.preventDefault();

    var textArea = $("#message");
    var msg = textArea.val();

    console.log("handleFormSubmit: ", msg);
    addMessage(msg);

    // Reset the message container to be empty
    textArea.val("");
}



/**
 * Makes AJAX call to the server and the message to it.
 */
function addMessage(msg) 
{

    // remove html tags from message
    msg = $("<div>" + msg + "</div>").text();

    $.post(
        "/api/wall/add",
        {'m': msg},
        function (resultMessage) 
        {
            // console.log("addMessage: ", result_message);
            displayResultStatus(resultMessage, false);

            // display new message on webpage
            displayNewMessage(msg);

            // Disable submit button for 5 seconds after message is added
            $("#message-send").prop("disabled", true);
            setTimeout(function () 
            {
                $("#message-send").prop("disabled", false);
            }, 5000);
           
        }
    );
}

// adds newest message in the message list to html list of displayed messages
function displayNewMessage(msg)
{
    $("#message-container").prepend('<li class="list-group-item">' + msg + "</li>");
}

// receives and displays all the messages in the message list
function displayMessages(result)
{
    console.log("getMessages: ", result);

    $("#message-container").empty();

    messages = result["messages"];  // session["wall"]
    for (var index in messages)
    {
        message_object = messages[index]; // get each dictionary object
        message = message_object["message"]; // get the actual message
        
        displayNewMessage(message)
    }
}

// Gets all messages from session and sends to displayMessages
function getMessages() 
{
    $.get(
        "/api/wall/list",
        function(result) 
        {
           displayMessages(result);
        }
    );
}


/**
 * This is a helper function that does nothing but show a section of the
 * site (the message result) and then hide it a moment later.
 */
function displayResultStatus(resultMsg, clearMessages) 
{
    // change color of message depending on user action
    if (clearMessages)
    {
        $("#sent-result").removeClass("alert-info").addClass("alert-danger");
    }
    else
    {
        $("#sent-result").removeClass("alert-danger").addClass("alert-info");;
    }
    var notificationArea = $("#sent-result");
    notificationArea.text(resultMsg);
    notificationArea.slideDown(function () 
    {
        // In JavaScript, "this" is a keyword that means "the object this
        // method or function is called on"; it is analogous to Python's
        // "self". In our case, "this" is the #sent-results element, which
        // is what slideDown was called on.
        //
        // However, when setTimeout is called, it won't be called on that
        // same #sent-results element--"this", for it, wouldn't be that
        // element. We could put inside of our setTimeout call the code
        // to re-find the #sent-results element, but that would be a bit
        // inelegant. Instead, we'll use a common JS idiom, to set a variable
        // to the *current* definition of self, here in this outer function,
        // so that the inner function can find it and where it will have the
        // same value. When stashing "this" into a new variable like that,
        // many JS programmers use the name "self"; some others use "that".
        var self = this;

        setTimeout(function () 
        {
            $(self).slideUp();
        }, 2000);
    });

}