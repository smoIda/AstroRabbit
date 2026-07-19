package com.astrorabbit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.astrorabbit.service.GithubService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GithubController {

  private final GithubService githubService;

  @GetMapping("/github")
  public ResponseEntity<Integer> getStar() {
    return ResponseEntity.ok(githubService.getStar());
  }
}
