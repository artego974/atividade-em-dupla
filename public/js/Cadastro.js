document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("btn-cadastrar");
  let tipoUsuario = "candidato"; // padrão inicial

  const candidato = document.getElementById("p-candidato");
  const empresa = document.getElementById("p-empresa");

  // Função para alternar seleção visual
  function selecionarTipo(tipo) {
    if (tipo === "candidato") {
      tipoUsuario = "candidato";
      candidato.classList.add("ativo");
      empresa.classList.remove("ativo");
    } else {
      tipoUsuario = "empresa";
      empresa.classList.add("ativo");
      candidato.classList.remove("ativo");
    }
  }

  // Eventos de clique
  candidato.addEventListener("click", () => selecionarTipo("candidato"));
  empresa.addEventListener("click", () => selecionarTipo("empresa"));

  // Clique do botão de cadastro
  form.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("senha").value.trim();

    if (!name || !email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    const url =
      tipoUsuario === "empresa"
        ? "http://localhost:3000/empresa"
        : "http://localhost:3000/user";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `${
            tipoUsuario === "empresa" ? "Empresa" : "Usuário"
          } cadastrado com sucesso!`
        );
        window.location.href = "./login.html";
      } else {
        alert(data.mensagem || "Erro ao cadastrar!");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
