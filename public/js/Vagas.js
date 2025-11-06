document.addEventListener("DOMContentLoaded", async () => {
  const listaVagas = document.getElementById("lista-vagas");

  try {
    const response = await fetch("http://localhost:3000/vagas");
    const vagas = await response.json();

    if (!response.ok) {
      throw new Error(vagas.mensagem || "Erro ao buscar vagas.");
    }

    if (vagas.length === 0) {
      listaVagas.innerHTML = "<p>Nenhuma vaga disponível no momento.</p>";
      return;
    }

    // Cria os cards de vagas
    vagas.forEach((vaga) => {
      const card = document.createElement("div");
      card.classList.add("card-vaga");

      card.innerHTML = `
        <h3>${vaga.titulo}</h3>
        <p>${vaga.descricao}</p>
        <p class="empresa">Empresa: ${vaga.empresa?.name || "Não informado"}</p>
        <button class="btn-detalhes" data-id="${
          vaga.id
        }">🔍 Ver detalhes</button>
      `;

      listaVagas.appendChild(card);
    });

    // Adiciona eventos de clique nos botões de detalhes
    document.querySelectorAll(".btn-detalhes").forEach((botao) => {
      botao.addEventListener("click", async (e) => {
        const vagaId = e.target.getAttribute("data-id");
        await abrirModalDetalhes(vagaId);
      });
    });
  } catch (error) {
    console.error("Erro ao carregar vagas:", error);
    listaVagas.innerHTML =
      "<p>Erro ao conectar ao servidor. Tente novamente mais tarde.</p>";
  }
});

// Função que busca e exibe os detalhes da vaga no modal
async function abrirModalDetalhes(vagaId) {
  try {
    const response = await fetch(`http://localhost:3000/vagas/${vagaId}`);
    if (!response.ok) throw new Error("Erro ao buscar detalhes da vaga");

    const vaga = await response.json();

    // Cria o conteúdo do modal dinamicamente
    const modal = document.createElement("div");
    modal.classList.add("modal-vaga");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="fechar-modal">&times;</span>
        <h2>${vaga.titulo}</h2>
        <p><strong>Descrição:</strong> ${vaga.descricao}</p>
        <p><strong>Localização:</strong> ${
          vaga.localizacao || "Não informada"
        }</p>
        <p><strong>Empresa:</strong> ${
          vaga.empresa?.name || "Não informada"
        }</p>
        <button class="btn-candidatar">✅ Candidatar-se</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Evento para fechar o modal
    modal.querySelector(".fechar-modal").addEventListener("click", () => {
      modal.remove();
    });

    // Fecha o modal clicando fora dele
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    // Evento de candidatura (opcional)
    modal
      .querySelector(".btn-candidatar")
      .addEventListener("click", async () => {
        alert(`Você se candidatou à vaga "${vaga.titulo}"!`);
        modal.remove();
      });
  } catch (error) {
    console.error("Erro ao abrir detalhes da vaga:", error);
    alert("Não foi possível carregar os detalhes da vaga.");
  }
}
