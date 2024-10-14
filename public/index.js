document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const button = form.querySelector('button');
            const buttonText = button.querySelector('.button-text');
            const spinner = button.querySelector('.fa-spinner');
            const resultDiv = document.getElementById(`result${form.id.slice(-1)}`);
            const sweepId = form.querySelector('input[name="sweepId"]').value;
            const isForm1 = form.id === 'form1';
            const includeAuth = isForm1 ? form.querySelector('input[name="auth"]').checked : true;
            
            // Show spinner, hide button text
            buttonText.style.display = 'none';
            spinner.style.display = 'inline-block';
            
            // Clear previous results
            resultDiv.innerHTML = '';
            resultDiv.className = 'result';
            
            try {
                const response = await callApi(sweepId, includeAuth, isForm1);
                displayResult(resultDiv, response);
            } catch (error) {
                displayResult(resultDiv, error);
            } finally {
                // Hide spinner, show button text
                buttonText.style.display = 'inline-block';
                spinner.style.display = 'none';
            }
        });
    });
});

async function callApi(sweepId, includeAuth, isForm1) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate different scenarios based on input
    if (!sweepId && !isForm1) {
        return { statusCode: 422, body: JSON.stringify({ message: "Unprocessable Entity: Sweep ID is required" }) };
    }

    if (!includeAuth) {
        return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized: Missing Authorization header" }) };
    }

    if (!sweepId && isForm1) {
        return { statusCode: 400, body: JSON.stringify({ message: "Bad Request: No Sweep ID provided" }) };
    }

    // Simulate successful response or not found
    const scenarios = [
        { statusCode: 200, body: JSON.stringify({ message: "Success", data: { id: sweepId, status: "completed" } }) },
        { statusCode: 404, body: JSON.stringify({ message: "Not found: No information for the provided sweep ID" }) }
    ];

    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

function displayResult(resultDiv, response) {
    const { statusCode, body } = response;
    const parsedBody = JSON.parse(body);

    resultDiv.innerHTML = `
        <h3>Status: ${statusCode}</h3>
        <pre>${JSON.stringify(parsedBody, null, 2)}</pre>
    `;

    if (statusCode >= 200 && statusCode < 300) {
        resultDiv.classList.add('success');
    } else {
        resultDiv.classList.add('error');
    }
}