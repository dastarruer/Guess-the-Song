const apiButton = document.getElementById("api");

apiButton.addEventListener("click", async () => {
    const accessToken = await getAccessToken();
});

async function getAccessToken() {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json();
    return data.access_token;
}
