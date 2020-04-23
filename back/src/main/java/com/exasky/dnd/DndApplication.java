package com.exasky.dnd;

import com.exasky.dnd.adventure.rest.dto.layer.LayerItemDeserializer;
import com.exasky.dnd.adventure.rest.dto.layer.LayerItemDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DndApplication {

	public static void main(String[] args) {
		SpringApplication.run(DndApplication.class, args);
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Autowired
	void configureObjectMapper(final ObjectMapper mapper) {
		final SimpleModule module = new SimpleModule();
		module.addDeserializer(LayerItemDto.class, new LayerItemDeserializer());
		mapper.registerModule(module);
	}
}
