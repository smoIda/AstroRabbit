package com.astrorabbit.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubDTO(@JsonProperty("stargazers_count") int star) {}
