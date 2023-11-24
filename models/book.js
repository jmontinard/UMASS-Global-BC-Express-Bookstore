const db = require("../db");


/** Collection of related methods for books. */

class Book {
  /** given an isbn, return book data with that isbn:
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   **/

  static async findOne(isbn) {
    const bookRes = await db.query(
        `SELECT isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year
            FROM books 
            WHERE isbn = $1`, [isbn]);

    if (bookRes.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}`, status: 404 }
    }

    return bookRes.rows[0];
  }

  /** Return array of book data:
   *
   * => [ {isbn, amazon_url, author, language,
   *       pages, publisher, title, year}, ... ]
   *
   * */

  static async findAll() {
    const booksRes = await db.query(
        `SELECT isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year
            FROM books 
            ORDER BY title`);

    return booksRes.rows;
  }

  /** create book in database from data, return book data:
   *
   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO books (
            isbn,
            amazon_url,
            author,
            language,
            pages,
            publisher,
            title,
            year) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING isbn,
                   amazon_url,
                   author,
                   language,
                   pages,
                   publisher,
                   title,
                   year`,
      [
        data.isbn,
        data.amazon_url,
        data.author,
        data.language,
        data.pages,
        data.publisher,
        data.title,
        data.year
      ]
    );

    return result.rows[0];
  }

  /** Update data with matching ID to data, return updated book.

   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * */

  static async update(isbn, data) {
    const result = await db.query(
      `UPDATE books SET 
            amazon_url=($1),
            author=($2),
            language=($3),
            pages=($4),
            publisher=($5),
            title=($6),
            year=($7)
            WHERE isbn=$8
        RETURNING isbn,
                  amazon_url,
                  author,
                  language,
                  pages,
                  publisher,
                  title,
                  year`,
      [
        data.amazon_url,
        data.author,
        data.language,
        data.pages,
        data.publisher,
        data.title,
        data.year,
        isbn
      ]
    );

    if (result.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}`, status: 404 }
    }

    return result.rows[0];
  }

  // static async update(isbn, data) {
  //   // Extracting the fields that need to be updated
  //   const {
  //     amazon_url,
  //     author,
  //     language,
  //     pages,
  //     publisher,
  //     title,
  //     year
  //   } = data;
  
  //   // Construct the SET clause dynamically based on provided fields
  //   const setClause = [];
  //   const values = [];
  
  //   if (amazon_url !== undefined) {
  //     setClause.push(`amazon_url=($${setClause.length + 1})`);
  //     values.push(amazon_url);
  //   }
  
  //   if (author !== undefined) {
  //     setClause.push(`author=($${setClause.length + 1})`);
  //     values.push(author);
  //   }
  
  //   if (language !== undefined) {
  //     setClause.push(`language=($${setClause.length + 1})`);
  //     values.push(language);
  //   }
  
  //   if (pages !== undefined) {
  //     setClause.push(`pages=($${setClause.length + 1})`);
  //     values.push(pages);
  //   }
  
  //   if (publisher !== undefined) {
  //     setClause.push(`publisher=($${setClause.length + 1})`);
  //     values.push(publisher);
  //   }
  
  //   if (title !== undefined) {
  //     setClause.push(`title=($${setClause.length + 1})`);
  //     values.push(title);
  //   }
  
  //   if (year !== undefined) {
  //     setClause.push(`year=($${setClause.length + 1})`);
  //     values.push(year);
  //   }
  
  //   const query = `
  //     UPDATE books 
  //     SET ${setClause.join(', ')}
  //     WHERE isbn=$${values.length + 1}
  //     RETURNING isbn, amazon_url, author, language, pages, publisher, title, year
  //   `;
  
  //   const result = await db.query(query, [...values, isbn]);
  
  //   if (result.rows.length === 0) {
  //     throw { message: `There is no book with an isbn '${isbn}`, status: 404 };
  //   }
  
  //   return result.rows[0];
  // }
  

  /** remove book with matching isbn. Returns undefined. */

  static async remove(isbn) {
    const result = await db.query(
      `DELETE FROM books 
         WHERE isbn = $1 
         RETURNING isbn`,
        [isbn]);

    if (result.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}`, status: 404 }
    }
  }
}


module.exports = Book;
