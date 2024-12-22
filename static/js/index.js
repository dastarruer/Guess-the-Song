const apiButton = document.getElementById("api");

apiButton.addEventListener("click", async () => {
    const data = await getRandomBillboardHot100Song();
    console.log(data);
});

async function getRandomBillboardHot100Song() {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json();
    return data;
}
