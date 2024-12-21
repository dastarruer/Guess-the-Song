const apiButton = document.getElementById("api");
const billboardTop100PlaylistID = "6UeSakyzhiEt4NB3UAd6NQ?si=fb9ea777334348d1";

apiButton.addEventListener("click", async () => {
    const accessToken = await getAccessToken();
});

async function getAccessToken() {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json();
    return data.access_token;
}
