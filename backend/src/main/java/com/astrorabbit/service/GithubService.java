package com.astrorabbit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.astrorabbit.dto.GithubDTO;

@Service
@RequiredArgsConstructor
public class GithubService {

  private final RestClient restClient;

  @Cacheable("github-stars")
  public int getStar() {
    GithubDTO githubDTO = restClient
      .get()
      .uri("https://api.github.com/repos/1bnuuy/Bunvia")
      .retrieve()
      .body(GithubDTO.class);

    if (githubDTO == null) throw new Error("Unable to fetch Github repository");

    return githubDTO.star();
  }
}
