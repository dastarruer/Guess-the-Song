const apiButton = document.getElementById("api");

apiButton.addEventListener("click", async () => {
    const data = await fetch("http://localhost:8080/track");
    const json = await data.json()
    console.log(json);
});
