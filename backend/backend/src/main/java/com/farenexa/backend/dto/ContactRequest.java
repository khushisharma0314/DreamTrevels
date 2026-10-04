package com.farenexa.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContactRequest {

    @NotBlank(message = "Please enter your name.")
    @Size(
            min = 2,
            message = "Name must contain at least 2 characters."
    )
    private String name;


    @NotBlank(message = "Please enter your email address.")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Please enter a valid email address."
    )
    private String email;


    @NotBlank(message = "Please enter your phone number.")
    @Pattern(
            regexp = "^(\\+?[0-9]{1,4}[\\s-]?)?[0-9]{7,15}$",
            message = "Please enter a valid phone number."
    )
    private String phone;


    @NotBlank(message = "Please enter a subject.")
    @Size(
            min = 3,
            message = "Subject must contain at least 3 characters."
    )
    private String subject;


    @NotBlank(message = "Please enter your message.")
    @Size(
            min = 10,
            message = "Message must contain at least 10 characters."
    )
    private String message;


    public ContactRequest() {
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}