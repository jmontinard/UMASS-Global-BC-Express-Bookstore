// document.addEventListener('DOMContentLoaded', function () {
//     // Fetch and display the book list on page load
//     getBooks();
  
//     // Function to fetch and display the book list
//     function getBooks() {
//       axios.get('http://localhost:3000/books')
//         .then(response => {
//           displayBooks(response.data.books);
//         })
//         .catch(error => {
//           console.error('Error fetching books:', error);
//         });
//     }
  
//     // Function to display the book list
//     function displayBooks(books) {
//       const booksList = document.getElementById('books');
//       booksList.innerHTML = '';
  
//       books.forEach(book => {
//         const li = document.createElement('li');
//         li.textContent = `${book.title} by ${book.author}`;
//         booksList.appendChild(li);
//       });
//     }
  
//     // Function to fetch a book by ISBN
//     window.getBook = function () {
//       const isbnInput = document.getElementById('isbnInput').value;
  
//       axios.get(`http://localhost:3000/books/${isbnInput}`)
//         .then(response => {
//           alert(`Book found!\nTitle: ${response.data.book.title}\nAuthor: ${response.data.book.author}`);
//         })
//         .catch(error => {
//           console.error('Error fetching book:', error);
//         });
//     };
  
//     // Function to update a book
//     window.updateBook = function () {
//       const isbnInput = document.getElementById('isbnInput').value;
//       const updateAuthorInput = document.getElementById('updateAuthorInput').value;
//       const updateLanguageInput = document.getElementById('updateLanguageInput').value;
  
//       axios.put(`http://localhost:3000/books/${isbnInput}`, {
//         author: updateAuthorInput,
//         language: updateLanguageInput
//         // Add other fields as needed for partial update
//       })
//         .then(response => {
//           alert(`Book updated!\nTitle: ${response.data.book.title}\nAuthor: ${response.data.book.author}`);
//           // Fetch and display the updated book list
//           getBooks();
//         })
//         .catch(error => {
//           console.error('Error updating book:', error);
//         });
//     };
//   });
  

document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:3000/api/books"; // Replace with your actual backend URL

  // Function to fetch and display all books
  async function displayBooks() {
    try {
      const response = await axios.get(baseURL);
      const books = response.data.books;
      const bookList = document.getElementById("bookList");

      // Clear previous entries
      bookList.innerHTML = "";

      // Display books
      books.forEach(book => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = `${book.title} by ${book.author}`;
        bookList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  // Function to handle form submissions
  function handleFormSubmit(formId, method, successMessage) {
    const form = document.getElementById(formId);
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      try {
        let response;
        if (method === "delete") {
          response = await axios.delete(`${baseURL}/${formObject.isbnToDelete}`);
        } else if (method === "put") {
          response = await axios.put(`${baseURL}/${formObject.isbn}`, formObject);
        } else {
          response = await axios.post(baseURL, formObject);
        }

        console.log(response.data); // Log the response for debugging
        alert(successMessage); // Show a success message
        displayBooks(); // Refresh the book list after a successful operation
      } catch (error) {
        console.error("Error:", error);
        alert("Error occurred. Please check the console for details.");
      }
    });
  }

  // Display books on page load
  displayBooks();

  // Handle form submissions
  handleFormSubmit("addBookForm", "post", "Book added successfully!");
  handleFormSubmit("updateBookForm", "put", "Book updated successfully!");
  handleFormSubmit("deleteBookForm", "delete", "Book deleted successfully!");
});
