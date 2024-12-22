// TODO: Play a random song off of the billboard hot 100
const apiButton = document.getElementById("api");

apiButton.addEventListener("click", async () => {
    const data = await getRandomBillboardHot100Song();
    console.log(data);
});

async function getRandomBillboardHot100Song() {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json();
    const track =
        data.tracks.items[Math.floor(Math.random() * data.tracks.items.length)];
    return track;
}
