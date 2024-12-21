const apiButton = document.getElementById("api");

apiButton.addEventListener("click", async () => {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json()
    console.log(data)
});

