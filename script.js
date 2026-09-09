const planButton = document.getElementById("planButton");
const result = document.getElementById("result");
const activities = [
    {
        name: "Bowling",
        type: "eglence",
        time:2,
        price: 250
    },
    {
        name: "Sinema",
        type: "eglence",
        time:2,
        price:500
    }
];




    
    
    planButton.addEventListener("click", function () {
    const locationInput = document.getElementById("location");
    const timeInput = document.getElementById("time");
    const budgetInput = document.getElementById("budget");
    const peopleInput = document.getElementById("people");
    const activityInput = document.getElementById("activity");

    const location = locationInput.value;
    const time = Number(timeInput.value);
    const budget = Number(budgetInput.value);
    const people = Number(peopleInput.value);
    const activity = activityInput.value;

    const suitableActivities = activities.filter(function(item){
        return item.type === activity;
    });
    
    console.log(suitableActivities);

    console.log("Konum:", location);
    console.log("Zaman:", time);
    console.log("Bütçe:", budget);
    console.log("Kişi:", people);
    console.log("Aktivite:", activity);

});