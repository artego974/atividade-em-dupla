document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btn-login");
  let tipoUsuario = "candidato"; // padrão inicial

  const candidato = document.getElementById("p-candidato");
  const empresa = document.getElementById("p-empresa");

  // Alternar seleção visual
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

  // Clique no botão de login
  btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("senha").value.trim();

    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    const url =
      tipoUsuario === "empresa"
        ? "http://localhost:3000/empresa/login"
        : "http://localhost:3000/user/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `${
            tipoUsuario === "empresa" ? "Empresa" : "Usuário"
          } logado com sucesso!`
        );
        // Aqui você pode armazenar o token JWT, se o backend retornar um:
        // localStorage.setItem("token", data.token);
        if(tipoUsuario == "empresa"){
          window.location.href = "./criarVaga.html"; // redireciona para a página principal
        }
        else{
            window.location.href = "vagas.html"
        }
       
      } else {
        alert(data.mensagem || "Erro ao fazer login!");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
