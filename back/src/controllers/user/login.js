document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('loginResponse').innerText = result.message;
        } else {
            document.getElementById('loginResponse').innerText = `Error: ${result.message}`;
        }
    } catch (error) {
        document.getElementById('loginResponse').innerText = `Error: ${error.message}`;
    }
});