process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../app");
const db = require("../db");
const e = require("express");

// isbn of sample book
let book_isbn;

beforeEach(async () => {
    let result = await db.query(`
      INSERT INTO
        books (isbn, amazon_url,author,language,pages,publisher,title,year)
        VALUES(
          '123432122',
          'https://amazon.com/taco',
          'Elie',
          'English',
          100,
          'Nothing publishers',
          'my first book', 2008)
        RETURNING isbn`);
  
    book_isbn = result.rows[0].isbn
  });
  
  
  describe("POST /books", function () {
    test("Creates a new book", async function () {
      const response = await request(app)
          .post(`/books`)
          .send({
            isbn: '32794782',
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "amazing times",
            year: 2000
          });
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toHaveProperty("isbn");
    });
  
    test("Prevents creating book without required title", async function () {
      const response = await request(app)
          .post(`/books`)
          .send({year: 2000});
      expect(response.statusCode).toBe(400);
    });
  });
  
  describe("GET /books", function () {
   test("gets all books", async function () {
     const response = await request(app)
     .get('/books')
     
     expect(response).toHaveLength(1);;
     expect(response[0]).toHaveProperty("isbn")
     expect(response[0]).toHaveProperty("author")

   })
  });
  

  describe("GET /books/:id", function () {
    test("get a book with id matching isbn", async function () {
      const response = await request(app)
      .get(`/books:${book_isbn}`)
      
      expect(response).toHaveLength(1);;
      expect(response[0].isbn).toBe(book_isbn)
      expect(response[0].author).toBe("Elie")
    });
    test("If an invalid book id/isbn was entered it returns a 404", async function () {
        const response = await request(app)
            .get(`/books/1276`)
        expect(response.statusCode).toBe(404);
      });
   });
   

   describe("PUT /books/:id", function () {
    test("Updates a single book", async function () {
        const response = await request(app)
        .put(`/books:${book_isbn}`)
        .send({
          amazon_url: "https://amazon.com/taco",
          author: "Trader Joes",
          language: "english",
          pages: 100,
          publisher: "Nothing publishers",
          title: "Secrets revealed",
          year: 2008
    })
     expect(response).toHaveLength(1);
     expect(response[0].author).not.toBe("Elie")
     expect(response[0].author).toBe("Trader Joes")
     expect(response[0].title).not.toBe("my first book")
     expect(response[0].title).toBe("Secrets revealed")
     expect(response[0]).toHaveProperty("year")

    });

    test("Returns 400 if an invalid book update", async function () {
        const response = await request(app)
        .put(`/books:${book_isbn}`)
        .send({
          "id": 1234,  
          amazon_url: "https://amazon.com/taco",
          author: "Trader Joes",
          language: "english",
          pages: 100,
          publisher: "Nothing publishers",
          title: "Secrets revealed",
          year: 2008,
          ghost_writer: "Drake"
    })
    expect(response.statusCode).toBe(400);
    });

    test("Responds 404 if can't find book in question", async function () {
        // delete book first
        await request(app)
            .delete(`/books/${book_isbn}`)
        const response = await request(app).delete(`/books/${book_isbn}`);
        expect(response.statusCode).toBe(404);
      });


})


describe("DELETE /books/:id", function () {
    test("Deletes a single a book", async function () {
        const response = await request(app)
        .delete(`/books/${book_isbn}`)
        expect(response.body).toEqual({message: "Book deleted"});
    });
    });

afterEach(async function () {
    await db.query("DELETE FROM BOOKS");
  });
  
  
  afterAll(async function () {
    await db.end()
  });
  