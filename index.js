const scriptURL = 'https://script.google.com/a/macros/icoutech.com/s/AKfycbysmKjratn5HtRpBFGnTlhkQHxGAG_hKuEP9Jx5GNQ76Rec7zSSI1GfiO043Ija4PJGVw/exec';
const form = document.getElementById('formulario');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dataForm = new FormData(form);
  const objectPost = Object.fromEntries(dataForm.entries()); // Transforma em JSON
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(objectPost),
  };
  
  try {
    const response = await fetch(scriptURL, options);
    if (response.ok) {
      alert('Formulário enviado com sucesso!');
    } else {
      throw new Error('Erro no envio!');
    }
  } catch (error) {
    alert('Erro ao enviar o formulário!');
    console.error(error);
  }
});