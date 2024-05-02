// main.ts

async function fetchData() {
  try {
      const response = await fetch('/api/data'); // Fetch data from your API endpoint
      const data = await response.json();

      const tableBody = document.querySelector('tbody');
      data.forEach((item) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td><img src="${item.imageUrl}" alt="${item.name}" width="100"></td>
          `;
          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

fetchData();
