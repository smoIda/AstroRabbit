package com.astrorabbit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.Cacheable;

import io.github.cdimascio.dotenv.Dotenv;

// Fuck the Error: Could not find or load main class com.isos.Application
// Fixed by renaming the folder from「10」ISOS to [10] isos 
// Caused by Japanese's brackets
@SpringBootApplication
@Cacheable
public class Application {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
            .directory("backend")
            .filename(".env.local")
            .ignoreIfMissing()
            .load();
    
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
        
        SpringApplication.run(Application.class, args);
    }
}

