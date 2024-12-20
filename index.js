const sections = document.querySelectorAll('.form-section'); // Sessões da página
const sectionsForm = document.querySelectorAll('.requiredFields'); // Seleciona os campos do formulário
const nextButton = document.getElementById('nextButton'); // Botão Proximo
const prevButton = document.getElementById('prevButton'); // Botão Voltar
const submitButton = document.getElementById('submitButton'); // Botão Enviar
const policyCheckbox = document.getElementById('policyCheckbox'); // Botão para marcar como lida a pólitica de segurança
const labelFieldArr = Array();
const messageErrorArr = Array();
let userChoices = Array();
let currentSection = 0;

// Função para mudar as páginas e garantir que o usuário leia a pólitica de segurança.
function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === index);
  });
  prevButton.style.display = index === 0 ? 'none' : 'inline-block';
  nextButton.style.display = index === sections.length - 1 ? 'none' : 'inline-block';
  submitButton.style.display = index === sections.length - 1 ? 'inline-block' : 'none';
};

// Lógica para acionar os botões "Próximo" "Anterior"
nextButton.addEventListener('click', () => {
  window.scrollTo({ top: 0 });
  if (currentSection === 0 && !policyCheckbox.checked) {
    alert('Por favor, confirme que leu a Política de Segurança antes de continuar.');
    window.scrollTo({ top: 0 });
    return;
  };
  if (currentSection === 1) {
    verifyFields();
  } else if (currentSection === 0 && policyCheckbox.checked) {
    if (currentSection < sections.length - 1) {
      currentSection++;
      showSection(currentSection);
    };
  };
});

prevButton.addEventListener('click', () => {
  if (currentSection === 1) {
    currentSection--;
    showSection(currentSection);
    window.location.reload();
    window.scrollTo({ top: 0 });
  };

  if (currentSection === 2) {
    currentSection--;
    showSection(currentSection);
    window.scrollTo({ top: 0 });
  };
});
showSection(currentSection);

// Lógica para aplicar a máscara no campo CPF/CNPJ
document.getElementById("cpf-cnpj").addEventListener("input", function (e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, ""); // Remove tudo que não for número
  let formattedValue = "";

  if (value.length <= 11) {
    // Aplica máscara de CPF (000.000.000-00)
    formattedValue = value
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  } else {
    // Aplica máscara de CNPJ (00.000.000/0000-00)
    formattedValue = value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  input.value = formattedValue; // Atualiza o valor do input com a máscara
});

// Máscara para Telefone
document.getElementById("telefone").addEventListener("input", function (e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, ""); // Remove tudo que não for número
  let formattedValue = "";

  if (value.length <= 10) {
    // Máscara para telefone fixo: (00) 0000-0000
    formattedValue = value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Máscara para telefone celular: (00) 00000-0000
    formattedValue = value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
  input.value = formattedValue;
});

// Validação e formatação de E-mail (simples)
document.getElementById("email").addEventListener("input", function (e) {
  let input = e.target;
  input.value = input.value
    .replace(/[^a-zA-Z0-9@._-]/g, "") // Remove caracteres inválidos
    .replace(/(\..*)\./g, "$1"); // Evita dois pontos consecutivos
});

// Máscara para CEP
document.getElementById("cep").addEventListener("input", function (e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, ""); // Remove tudo que não for número
  // Máscara para CEP: 00000-000
  input.value = value.replace(/^(\d{5})(\d)/, "$1-$2");
});

// Aplica a mensagem de erro se deixar os determinados campos vazios 
function verifyFields() {
  sectionsForm.forEach((field, i) => {
    if (field.hasAttribute("required") && !field.value) {
      let labelField = document.querySelector(`label[for="${field.name}"]`);
      let messageError = document.querySelector(`.${field.name}`);
      window.scrollTo({ top: 0 });
      field.classList.add("error");
      labelField.classList.add("error-label");
      messageError.style.display = 'inline-block';

      labelFieldArr.push(labelField);
      messageErrorArr.push(messageError);
      userChoices.push(field);
    };
  });
  if (userChoices.length === 0) {
    if (currentSection < sections.length - 1) {
      currentSection++;
      showSection(currentSection);
    };
  };
  userChoices.length = 0;
};

// Lógica para verificar campos vazios
document.addEventListener('focus', (event) => {
  const focusEvent = event.target
  focusEvent.classList.remove("error");
  labelFieldArr.forEach((label) => {
    if (focusEvent.id === label.getAttribute('for')) {
      label.classList.remove("error-label");
    };
  });
  messageErrorArr.forEach((message) => {
    if (message.classList.contains(focusEvent.id)) {
      message.style.display = 'none';
    };
  });
}, true);

// Lógica para enviar os dados para a planilha google sheets
// Adiciona um evento de envio para o formulário
document.getElementById('icoutechForm').addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o envio padrão

  // Cria um objeto FormData com os dados do formulário
  const formData = new FormData(this);

  // Envia os dados para o Google Apps Script usando fetch
  fetch(this.action, {
    method: "POST",
    body: formData
  })
  .then(response => response.json())  // Espera uma resposta JSON do Apps Script
  .then(data => {
    console.log("Resposta recebida:", data);
    alert("Dados enviados com sucesso!");
  })
  .catch(error => {
    console.error("Erro ao enviar os dados:", error);
    alert("Ocorreu um erro ao enviar os dados.");
  });
});
