package com.astrorabbit.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class GithubConfig {

  @Bean
  RestClient restClient() {
    return RestClient.create();
  }
}
