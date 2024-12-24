const scriptURL = 'https://script.google.com/macros/s/AKfycbyLquSNqasK0titFS4bCsTbLTRDSix-lNFZXnHionJWVDHzaY0hCSsonI-lL0jjFrFUUw/exec'; // Replace with your Google Apps Script URL
const form = document.getElementById('googleSheetsForm');
const responseMessage = document.getElementById('responseMessage');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData,
        });
        console.log(formData);
        

        if (response.ok) {
            responseMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            form.reset();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        responseMessage.style.display = 'none';
        errorMessage.style.display = 'block';
    }
});