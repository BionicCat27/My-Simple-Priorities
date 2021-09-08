function initListeners() {
    addPriorityListener();
    deletePriorityListener();
    moveUpListener();
    moveDownListener();
}

function addPriorityListener() {
    $("#PriorityButton").off("click").click(function() {
        addPriority();
    });
}

function deletePriorityListener() {
    $('.delete-priority').off("click").click(function() {

        var answer = confirm("Delete this priority?");
        if (answer) {
            $(this).parent().parent().remove();
        }
    });
}

function moveUpListener() {
    $('.moveup-priority').off("click").click(function(){
        $(this).parent().parent().prev().insertAfter($(this).parent().parent());
    });
}

function moveDownListener() {
    $('.movedown-priority').off("click").click(function(){
        $(this).parent().parent().next().insertBefore($(this).parent().parent());
    });
}


initListeners();

var PriorityField = document.getElementById("PriorityField");
var PriorityContent = document.getElementById("PriorityContent");

function addPriority() {
    //Check value isn't empty
    if(PriorityField.value == "") {
        return;
    }
    //Create priority card
    var PrioritiesBlock = document.getElementById("PrioritiesBlock");
    var PriorityCard = document.createElement("div");
    PriorityCard.classList.add("div-card");
    var PriorityText = document.createElement("h3");
    PriorityText.innerText = PriorityField.value;

    //Create priority card buttons
    var ButtonBlock = document.createElement("div");
    ButtonBlock.classList.add("button-block");
    var PriorityUp = document.createElement("button");
    PriorityUp.innerText = "Move Up";
    PriorityUp.classList.add("moveup-priority");
    var PriorityDown = document.createElement("button");
    PriorityDown.innerText = "Move Down";
    PriorityDown.classList.add("movedown-priority");
    var PriorityDelete = document.createElement("button");
    PriorityDelete.innerText = "Delete Priority";
    PriorityDelete.classList.add("delete-priority");

    //Add buttons to button group
    ButtonBlock.append(PriorityUp);
    ButtonBlock.append(PriorityDown);
    ButtonBlock.append(PriorityDelete);

    //Add elements to priority card
    PriorityCard.append(PriorityText);
    PriorityCard.append(ButtonBlock);
    PrioritiesBlock.append(PriorityCard);
    PriorityField.value = "";

    initListeners();
}
