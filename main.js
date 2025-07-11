// ✅ Remplace toute la fonction showSection par celle-ci :
function loadSection(sectionId) {
  const fileMap = {
    home: "home.html",
    create: "create.html",
    topology: "topologie.html",
    ai: "ia.html",
    monitoring: "monitoring.html",
  };

  const fileName = fileMap[sectionId] || "home.html";

  fetch(fileName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur de chargement du fichier : ${fileName}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("content").innerHTML = html;

      // Si on est sur "create", on initialise la topologie
      if (sectionId === "create" && typeof initTopology === "function") {
        initTopology();
      }
    })
    .catch((error) => {
      document.getElementById("content").innerHTML = `
          <div class="text-red-600 text-center p-4 bg-red-100 rounded">
            Erreur : ${error.message}
          </div>`;
    });
}

// Menu mobile
document
  .getElementById("mobile-menu-button")
  .addEventListener("click", function () {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  });

// Initialisation des graphiques
document.addEventListener("DOMContentLoaded", function () {
  // Graphique de trafic
  const trafficCtx = document.getElementById("traffic-chart").getContext("2d");
  const trafficChart = new Chart(trafficCtx, {
    type: "line",
    data: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      datasets: [
        {
          label: "Trafic Entrant (Mbps)",
          data: [12, 19, 3, 5, 2, 3],
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Trafic Sortant (Mbps)",
          data: [8, 15, 5, 8, 3, 6],
          borderColor: "rgb(236, 72, 153)",
          backgroundColor: "rgba(236, 72, 153, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Graphique de latence
  const latencyCtx = document.getElementById("latency-chart").getContext("2d");
  const latencyChart = new Chart(latencyCtx, {
    type: "bar",
    data: {
      labels: [
        "Switch1-Switch2",
        "Switch2-Router1",
        "Router1-Switch3",
        "Switch3-Switch4",
        "Switch4-Host5",
      ],
      datasets: [
        {
          label: "Latence (ms)",
          data: [12, 19, 8, 15, 7],
          backgroundColor: [
            "rgba(99, 102, 241, 0.7)",
            "rgba(99, 102, 241, 0.7)",
            "rgba(99, 102, 241, 0.7)",
            "rgba(99, 102, 241, 0.7)",
            "rgba(99, 102, 241, 0.7)",
          ],
          borderColor: [
            "rgb(99, 102, 241)",
            "rgb(99, 102, 241)",
            "rgb(99, 102, 241)",
            "rgb(99, 102, 241)",
            "rgb(99, 102, 241)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Graphique de bande passante
  const bandwidthCtx = document
    .getElementById("bandwidth-chart")
    .getContext("2d");
  const bandwidthChart = new Chart(bandwidthCtx, {
    type: "doughnut",
    data: {
      labels: ["Utilisée", "Disponible"],
      datasets: [
        {
          data: [65, 35],
          backgroundColor: ["rgb(99, 102, 241)", "rgb(203, 213, 225)"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Initialisation de la topologie
  initTopology();
});

// Gestion de la topologie
function initTopology() {
  const svg = document.getElementById("topology-canvas");
  const ns = "http://www.w3.org/2000/svg";

  // Exemple de topologie simple
  const switch1 = document.createElementNS(ns, "circle");
  switch1.setAttribute("cx", "150");
  switch1.setAttribute("cy", "150");
  switch1.setAttribute("r", "30");
  switch1.setAttribute("fill", "#4f46e5");
  switch1.setAttribute("class", "network-node");
  switch1.setAttribute("data-type", "switch");
  switch1.setAttribute("data-id", "switch1");
  svg.appendChild(switch1);

  const switch1Text = document.createElementNS(ns, "text");
  switch1Text.setAttribute("x", "150");
  switch1Text.setAttribute("y", "150");
  switch1Text.setAttribute("text-anchor", "middle");
  switch1Text.setAttribute("dy", ".3em");
  switch1Text.setAttribute("fill", "white");
  switch1Text.textContent = "S1";
  svg.appendChild(switch1Text);

  const router1 = document.createElementNS(ns, "rect");
  router1.setAttribute("x", "300");
  router1.setAttribute("y", "150");
  router1.setAttribute("width", "60");
  router1.setAttribute("height", "40");
  router1.setAttribute("rx", "5");
  router1.setAttribute("fill", "#10b981");
  router1.setAttribute("class", "network-node");
  router1.setAttribute("data-type", "router");
  router1.setAttribute("data-id", "router1");
  svg.appendChild(router1);

  const router1Text = document.createElementNS(ns, "text");
  router1Text.setAttribute("x", "330");
  router1Text.setAttribute("y", "170");
  router1Text.setAttribute("text-anchor", "middle");
  router1Text.setAttribute("dy", ".3em");
  router1Text.setAttribute("fill", "white");
  router1Text.textContent = "R1";
  svg.appendChild(router1Text);

  const link1 = document.createElementNS(ns, "line");
  link1.setAttribute("x1", "180");
  link1.setAttribute("y1", "150");
  link1.setAttribute("x2", "300");
  link1.setAttribute("y2", "150");
  link1.setAttribute("class", "network-link");
  svg.appendChild(link1);

  // Gestion des clics sur les nœuds
  const nodes = document.querySelectorAll(".network-node");
  nodes.forEach((node) => {
    node.addEventListener("click", function () {
      const type = this.getAttribute("data-type");
      const id = this.getAttribute("data-id");

      let properties = "";
      if (type === "switch") {
        properties = `
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-2">Nom</label>
                                <input type="text" value="${id}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-2">Ports</label>
                                <input type="number" value="24" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-2">VLANs</label>
                                <input type="text" value="10,20,30" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                        `;
      } else if (type === "router") {
        properties = `
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-2">Nom</label>
                                <input type="text" value="${id}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-2">Interfaces</label>
                                <input type="number" value="4" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-2">Protocoles</label>
                                <input type="text" value="OSPF, BGP" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                        `;
      }

      document.getElementById("properties-panel").innerHTML = properties;
    });
  });
}

// Ajout de nœuds
function addNode(type) {
  const svg = document.getElementById("topology-canvas");
  const ns = "http://www.w3.org/2000/svg";

  // Générer une position aléatoire
  const x = Math.floor(Math.random() * 400) + 50;
  const y = Math.floor(Math.random() * 400) + 50;
  const id = `${type}${Math.floor(Math.random() * 1000)}`;

  let node;
  if (type === "switch") {
    node = document.createElementNS(ns, "circle");
    node.setAttribute("cx", x);
    node.setAttribute("cy", y);
    node.setAttribute("r", "30");
    node.setAttribute("fill", "#4f46e5");
  } else if (type === "router") {
    node = document.createElementNS(ns, "rect");
    node.setAttribute("x", x - 30);
    node.setAttribute("y", y - 20);
    node.setAttribute("width", "60");
    node.setAttribute("height", "40");
    node.setAttribute("rx", "5");
    node.setAttribute("fill", "#10b981");
  } else if (type === "host") {
    node = document.createElementNS(ns, "rect");
    node.setAttribute("x", x - 25);
    node.setAttribute("y", y - 25);
    node.setAttribute("width", "50");
    node.setAttribute("height", "50");
    node.setAttribute("rx", "3");
    node.setAttribute("fill", "#6366f1");
  } else if (type === "server") {
    node = document.createElementNS(ns, "rect");
    node.setAttribute("x", x - 30);
    node.setAttribute("y", y - 20);
    node.setAttribute("width", "60");
    node.setAttribute("height", "40");
    node.setAttribute("rx", "3");
    node.setAttribute("fill", "#ec4899");
  }

  node.setAttribute("class", "network-node");
  node.setAttribute("data-type", type);
  node.setAttribute("data-id", id);
  svg.appendChild(node);

  // Ajouter le texte
  const text = document.createElementNS(ns, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dy", ".3em");
  text.setAttribute("fill", "white");
  text.textContent =
    id.charAt(0).toUpperCase() + id.slice(1).replace(/\d+/g, "");
  svg.appendChild(text);

  // Ajouter un gestionnaire d'événements
  node.addEventListener("click", function () {
    const type = this.getAttribute("data-type");
    const id = this.getAttribute("data-id");

    let properties = "";
    if (type === "switch") {
      properties = `
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Nom</label>
                            <input type="text" value="${id}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Ports</label>
                            <input type="number" value="24" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">VLANs</label>
                            <input type="text" value="10,20,30" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                    `;
    } else if (type === "router") {
      properties = `
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Nom</label>
                            <input type="text" value="${id}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Interfaces</label>
                            <input type="number" value="4" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Protocoles</label>
                            <input type="text" value="OSPF, BGP" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                    `;
    } else if (type === "host" || type === "server") {
      properties = `
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Nom</label>
                            <input type="text" value="${id}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Adresse IP</label>
                            <input type="text" value="192.168.1." class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">MAC</label>
                            <input type="text" value="00:1A:2B:3C:4D:5E" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                    `;
    }

    document.getElementById("properties-panel").innerHTML = properties;
  });
}
