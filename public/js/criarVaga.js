const empresaId = localStorage.getItem("empresaId") || 1;
const API_URL = "http://localhost:3000";

async function criarVaga(event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const localizacao = document.getElementById("localizacao").value.trim();

  if (!titulo || !descricao || !localizacao) {
    alert("⚠️ Preencha todos os campos antes de criar a vaga!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/empresa/${empresaId}/vagas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descricao, localizacao }),
    });

    if (!response.ok) throw new Error(await response.text());

    alert("✅ Vaga criada com sucesso!");
    document.getElementById("formVaga").reset();
    carregarVagas();
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    alert("❌ Falha ao criar vaga. Verifique o servidor.");
  }
}

async function carregarVagas() {
  const lista = document.getElementById("lista-vagas");
  lista.innerHTML = "<p>Carregando vagas...</p>";

  try {
    const response = await fetch(`${API_URL}/vagas`);
    if (!response.ok) throw new Error("Erro ao buscar vagas");

    const vagas = await response.json();
    lista.innerHTML = "";

    if (vagas.length === 0) {
      lista.innerHTML = "<p>Nenhuma vaga cadastrada.</p>";
      return;
    }

    vagas.forEach((vaga) => {
      const card = document.createElement("div");
      card.classList.add("card-vaga");

      card.innerHTML = `
        <h3>${vaga.titulo}</h3>
        <p><strong>Localização:</strong> ${vaga.localizacao}</p>
        <div class="botoes-card">
          <button class="btn-detalhes" data-id="${vaga.id}">👁️ Ver detalhes</button>
          <button class="btn-editar" data-id="${vaga.id}">✏️ Editar</button>
          <button class="btn-excluir" data-id="${vaga.id}">🗑️ Excluir</button>
        </div>
      `;

      lista.appendChild(card);
    });

    document.querySelectorAll(".btn-excluir").forEach((btn) =>
      btn.addEventListener("click", excluirVaga)
    );

    document.querySelectorAll(".btn-detalhes").forEach((btn) =>
      btn.addEventListener("click", abrirModalDetalhes)
    );

  } catch (error) {
    console.error("Erro ao carregar vagas:", error);
    lista.innerHTML = "<p>❌ Erro ao carregar vagas.</p>";
  }
}

async function abrirModalDetalhes(event) {
  const vagaId = event.target.dataset.id;

  try {
    const response = await fetch(`${API_URL}/vagas/${vagaId}`);
    if (!response.ok) throw new Error("Erro ao buscar detalhes da vaga");

    const vaga = await response.json();

    const modal = document.getElementById("modalDetalhes");
    const conteudo = document.getElementById("conteudoModal");

    conteudo.innerHTML = `
      <h2>${vaga.titulo}</h2>
      <p><strong>Descrição:</strong> ${vaga.descricao}</p>
      <p><strong>Localização:</strong> ${vaga.localizacao}</p>
      ${
        vaga.empresa
          ? `<p><strong>Empresa:</strong> ${vaga.empresa.nome}</p>`
          : ""
      }
    `;

    modal.style.display = "flex";
  } catch (error) {
    console.error("Erro ao abrir detalhes da vaga:", error);
    alert("❌ Não foi possível abrir os detalhes da vaga.");
  }
}

function fecharModal() {
  document.getElementById("modalDetalhes").style.display = "none";
}

async function excluirVaga(event) {
  const vagaId = event.target.dataset.id;
  if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

  try {
    const response = await fetch(`${API_URL}/vagas/${vagaId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir vaga");

    alert("🗑️ Vaga excluída com sucesso!");
    carregarVagas();
  } catch (error) {
    console.error("Erro ao excluir vaga:", error);
    alert("❌ Falha ao excluir vaga.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formVaga");
  if (form) form.addEventListener("submit", criarVaga);
  carregarVagas();

  document
    .getElementById("fecharModal")
    .addEventListener("click", fecharModal);
});
