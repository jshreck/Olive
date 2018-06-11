$(document).ready(() => {

    //initialize modal
    $('.modal').modal();

    //auto scrape
    $.get("/scrape", (res) => {
        console.log(res);
    })

    //opening modal -> get note for article (if exists)
    $(document).on("click", ".modal-trigger", (clicked) => {

        var id = $(clicked.currentTarget).data("id");
        $(".modal-close").attr("data-id", id);

        $("#note-title").val("");
        $("#note-body").val("");

        $.ajax({
            url: `/note/article/${id}`,
            type: "GET",
        }).then((response) => {
            console.log("response = " + JSON.stringify(response));
            
            //auto inserts article name as title (if none found) and then replaces title if found and gives body
            $("#note-title").val(response.title);
            $("#note-title").val(response.note.title);
            $("#note-body").val(response.note.body);
            //pass note to erase button for clearing/deleting
            var noteID = response.note._id;
            console.log(noteID);
            $("#erase").attr("data-noteid", `${noteID}`);
        });
    });


    //closing modal -> save (update)
    $(document).on("click", ".modal-close", (clicked) => {

        var id = $(clicked.currentTarget).data("id");

        $.ajax({
            url: `/api/article/${id}`,
            type: "POST",
            dataType: "json",
            data: {
                title: $("#note-title").val(),
                body: $("#note-body").val()
            }
        }).then((response) => {
            console.log("response = " + JSON.stringify(response));
        });

    });

    //erasing notes (deletes note)
    $(document).on("click", "#erase", (clicked) => {

        var noteID = $(clicked.currentTarget).data("noteid");

        $.ajax({
            url: `/api/delete/note/${noteID}`,
            type: "POST",
        }).then((response) => {
            console.log("response = " + JSON.stringify(response)); 
            //if no note, no noteID is captured and error returned
            $("#note-title").val("");
            $("#note-body").val("");
        });

    });

    //saving article
    $(document).on("click", ".update-save", (clicked) => {

        var id = $(clicked.currentTarget).data("id");
        var saved = $(clicked.currentTarget).data("saved");

        $.ajax({
            url: `/api/updateSave/${id}`,
            type: "PUT",
            dataType: "json",
            data: { saved: saved }
        }).then((response) => {
            //clear current star and then update it with what it should look like (based on server response)
            console.log("response = " + response.saved);
            $(`.update-save[data-id=${response._id}] i`).empty();

            if (response.saved) {
                $(`.update-save[data-id=${response._id}]`).attr("data-saved", "true");
                $(`.update-save[data-id=${response._id}] i`).html("star");

            }
            else {
                $(`.update-save[data-id=${response._id}]`).attr("data-saved", "false");
                $(`.update-save[data-id=${response._id}] i`).html("star_border");
                //if on saved page, delete the li from the pg
                if (window.location.href === "http://localhost:3000/saved") {
                    $(`li[data-id=${response._id}]`).empty();
                }

            }
        })
    });
});
