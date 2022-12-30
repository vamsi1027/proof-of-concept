package com.motivity.actuatorandswagger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(
		title = "Actuator And Swagger Application API's", 
		version = "1.0", 
		description = "API Information for Actuator And Swagger Application API's"))
public class ActuatorAndSwaggerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ActuatorAndSwaggerApplication.class, args);
	}

}