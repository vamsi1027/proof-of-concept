package com.motivity.actuatorandswagger;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Book Catalog", description = "Crud Operations For Book Catalog")
@RestController
public class BookController {

	private Map<Long, Book> bookCatalog;

	BookController() {
		bookCatalog = new HashMap<Long, Book>();
		bookCatalog.put(1L, new Book(1, "Spring in Action", "Craig Walls", "2021", 4040.78));
		bookCatalog.put(2L, new Book(2, "Microservices in Action", "Morgan Bruce", "2018", 3477.00));
	}

	@Operation(summary = "List Of Books", description = "Retrieves The List Of Books From Book Catalog")
	@ApiResponse(responseCode = "200", description = "Retrieved Books Successfully")
	@GetMapping("/")
	public ResponseEntity<List<Book>> getBookList() {
		return ResponseEntity.ok(new ArrayList<>(bookCatalog.values()));
	}

	@Operation(summary = "Add Book", description = "Adds New Book To The Book Catalog")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Book Added Successfully To The Book Catalog"),
			@ApiResponse(responseCode = "409", description = "Book With This Id Already Exists In Book Catalog"),
			@ApiResponse(responseCode = "422", description = "Invalid Book Details") })
	@PostMapping("/book")
	public ResponseEntity<String> addBook(@RequestBody Book book) {
		StringBuffer buffer = validateBookDetails(book);
		if (buffer.toString().length() > 0) {
			return new ResponseEntity<>(buffer.toString(), HttpStatus.UNPROCESSABLE_ENTITY);
		}
		if (bookCatalog.get(book.getId()) != null) {
			return new ResponseEntity<>("Book With The Id: " + book.getId() + " Already Exists In Book Catalog",
					HttpStatus.CONFLICT);
		}
		bookCatalog.put(book.getId(), book);
		return new ResponseEntity<>("Book Added Successfully To The Book Catalog", HttpStatus.CREATED);
	}

	@Operation(summary = "Get Book By Book Id", description = "Retrieves The Book Details For Given Book Id From Book Catalog")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Successfully Retrieved Book With Given Id From Book Catalog"),
			@ApiResponse(responseCode = "404", description = "Failed To Retrieve The Book Details, Book With Given Id Doesn't Exists In Book Catalog") })
	@GetMapping("/book/{id}")
	public ResponseEntity<?> getBookDetails(@PathVariable long id) {
		Book book = bookCatalog.get(id);
		if (book != null) {
			return new ResponseEntity<Book>(book, HttpStatus.OK);
		}
		return new ResponseEntity<String>(
				"Failed To Retrieve The Book Details, Book With Id: " + id + " Not Found In Book Catalog",
				HttpStatus.NOT_FOUND);
	}

	@Operation(summary = "Update Book", description = "Updates The Book Details Which Is Already Present In Book Catalog")
	@ApiResponses(value = { 
			@ApiResponse(responseCode = "200", description = "Book Updated Successfully"),
			@ApiResponse(responseCode = "404", description = "Failed To Update The Book, Book Doesn't Exists In Book Catalog"),
			@ApiResponse(responseCode = "422", description = "Invalid Book Details") })
	@PutMapping("/book")
	public ResponseEntity<String> updateBook(@RequestBody Book book) {
		if (bookCatalog.get(book.getId()) == null) {
			return new ResponseEntity<>(
					"Failed To Update Book, Book With Id: " + book.getId() + " Not found In Book Catalog",
					HttpStatus.NOT_FOUND);
		}

		StringBuffer buffer = validateBookDetails(book);
		if (buffer.toString().length() > 0) {
			return new ResponseEntity<>(buffer.toString(), HttpStatus.UNPROCESSABLE_ENTITY);
		}

		bookCatalog.put(book.getId(), book);
		return ResponseEntity.ok("Book With Id: " + book.getId() + " Updated Successfully");
	}

	@Operation(summary = "Delete Book", description = "Deletes The Book From Book Catalog")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Book Deleted Successfully From Book Catalog"),
			@ApiResponse(responseCode = "404", description = "Failed To Delete The Book, Book Doesn't Exists In Book Catalog") })
	@DeleteMapping("/book/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable long id) {
		if (bookCatalog.get(id) != null) {
			bookCatalog.remove(id);
			return new ResponseEntity<>("Book With Id: " + id + " Deleted Successfully", HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<>("Failed to Delete Book, Book with Id: " + id + " Not found In Book Catalog",
				HttpStatus.NOT_FOUND);
	}

	private StringBuffer validateBookDetails(Book book) {
		StringBuffer buffer = new StringBuffer();

		if (book.getId() == 0)
			buffer.append("Book Id Cannot be 0 \n");
		if (book.getTitle().trim().isEmpty())
			buffer.append("Book Title Cannot Be Empty \n");
		if (book.getAuthor().trim().isEmpty())
			buffer.append("Author Name Cannot Be Empty \n");
		if (book.getYearOfPublication().trim().isEmpty())
			buffer.append("Year Of Publication Cannot be Empty \n");
		if (book.getPrice() == 0)
			buffer.append("Book Price Cannot Be 0 \n");

		return buffer;
	}
}