package com.motivity.actuatorandswagger;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class Book {

	@NotNull
	private long id;

	@NotEmpty
	private String title;

	@NotEmpty
	private String author;

	@NotEmpty
	private String yearOfPublication;

	@NotNull
	private double price;

	public Book() {
	}

	public Book(long id, String title, String author, String yearOfPublication, double price) {
		super();
		this.id = id;
		this.title = title;
		this.author = author;
		this.yearOfPublication = yearOfPublication;
		this.price = price;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getYearOfPublication() {
		return yearOfPublication;
	}

	public void setYearOfPublication(String yearOfPublication) {
		this.yearOfPublication = yearOfPublication;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "Book [id=" + id + ", title=" + title + ", author=" + author + ", yearOfPublication=" + yearOfPublication
				+ ", price=" + price + "]";
	}

}