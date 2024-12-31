import dotenv from 'dotenv';

dotenv.config();

export async function fetchGitHubRepos() {
  const username = 'Axel-Vargas';
  const token = process.env.GITHUB_TOKEN; // Agrega tu token aquí
  const url = `https://api.github.com/users/${username}/repos`;
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener repositorios: ${response.statusText}`);
  }

  const repos = await response.json();

  // Obtener los *topics* de cada repositorio
  for (const repo of repos) {
    const topicsResponse = await fetch(repo.url + "/topics", {
      headers: {
        Accept: "application/vnd.github.mercy-preview+json", // Necesario para obtener los topics
        Authorization: `token ${token}`, // Asegúrate de incluir el token para la autenticación
      },
    });

    const topicsData = await topicsResponse.json();
    repo.topics = topicsData.names; // Asigna los topics al repositorio
  }

  return repos;
}
