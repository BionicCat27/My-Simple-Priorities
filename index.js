function initListeners() {
    addPriorityListener();
    deletePriorityListener();
}

function addPriorityListener() {
    var AddPriorityButton = document.getElementById("PriorityButton");
    AddPriorityButton.addEventListener("click", function() {
        addPriority();
    });
}

function deletePriorityListener() {
    var DeletePriorityButtons = document.getElementsByClassName("delete-priority");
    for(var i = 0; i < DeletePriorityButtons.length; i++) {
        DeletePriorityButtons[i].addEventListener('click', function() {
            this.parentNode.parentNode.remove();
        });
    }
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
    var PriorityDown = document.createElement("button");
    PriorityDown.innerText = "Move Down";
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
