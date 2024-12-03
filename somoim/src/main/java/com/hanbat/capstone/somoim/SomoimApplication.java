package com.hanbat.capstone.somoim;

import com.hanbat.capstone.somoim.config.AppConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@ComponentScan(basePackages = "com.hanbat.capstone")
@Import(AppConfig.class)
public class SomoimApplication {
	public static void main(String[] args) {
		SpringApplication.run(SomoimApplication.class, args);
	}

}
