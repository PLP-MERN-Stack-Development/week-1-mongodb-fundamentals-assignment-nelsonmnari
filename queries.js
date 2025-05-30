const connectDB = require("./connectDB");

const [, , command, ...args] = process.argv;

async function run() {
  const { client, collection } = await connectDB();

  try {
    switch (command) {
      // 1. Find all books
      case "find_all":
        const all = await collection.find().toArray();
        console.table(all);
        break;

      // 2. Find books by author
      case "find_author":
        const author = args.join(" ");
        const byAuthor = await collection.find({ author }).toArray();
        console.table(byAuthor);
        break;

      // 3. Find books after a year
      case "find_after":
        const year = parseInt(args[0]);
        const after = await collection
          .find({ published_year: { $gt: year } })
          .toArray();
        console.table(after);
        break;

      // 4. Find books by genre
      case "find_genre":
        const genre = args.join(" ");
        const byGenre = await collection.find({ genre }).toArray();
        console.table(byGenre);
        break;

      // 5. Find in-stock books
      case "find_instock":
        const inStock = await collection.find({ in_stock: true }).toArray();
        console.table(inStock);
        break;

      // 6. Projection: show only title and author
      case "projection":
        const projected = await collection
          .find({}, { projection: { title: 1, author: 1, _id: 0 } })
          .toArray();
        console.table(projected);
        break;

      // 7. Update price of a book
      case "update_price":
        const [titleToUpdate, newPrice] = args;
        const updated = await collection.updateOne(
          { title: titleToUpdate },
          { $set: { price: parseFloat(newPrice) } }
        );
        console.log(` Updated ${updated.modifiedCount} document(s)`);
        break;

      // 8. Delete books under a certain price
      case "delete_under":
        const priceLimit = parseFloat(args[0]);
        const deleted = await collection.deleteMany({
          price: { $lt: priceLimit },
        });
        console.log(
          `Deleted ${deleted.deletedCount} books under $${priceLimit}`
        );
        break;

      // 9. Insert a new book
      case "insert_one":
        const [title, authorName] = args;
        const insertRes = await collection.insertOne({
          title,
          author: authorName,
          in_stock: true,
          published_year: 2024,
          genre: "Test",
          price: 15.99,
          pages: 250,
          publisher: "Self",
        });
        console.log(` Inserted book with ID: ${insertRes.insertedId}`);
        break;

      default:
        console.log(` Invalid command: ${command}`);
        console.log(`
Available commands:
  node queries.js find_all
  node queries.js find_author "George Orwell"
  node queries.js find_after 1950
  node queries.js find_genre "Fiction"
  node queries.js find_instock
  node queries.js projection
  node queries.js update_price "The Hobbit" 20.99
  node queries.js delete_under 9
  node queries.js insert_one "New Book" "New Author"
        `);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
