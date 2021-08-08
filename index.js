var AddPriorityButton = document.getElementById("PriorityButton");
AddPriorityButton.addEventListener("click", function() {
    addPriority();
});

var PriorityField = document.getElementById("PriorityField");
var PriorityContent = document.getElementById("PriorityContent");

function addPriority() {
    var PrioritiesBlock = document.getElementById("PrioritiesBlock");
    var PriorityCard = document.createElement("div");
    PriorityCard.classList.add("div-card");
    var PriorityText = document.createElement("h3");
    PriorityText.innerText = PriorityField.value;

    PriorityCard.append(PriorityText);
    PrioritiesBlock.append(PriorityCard);

}