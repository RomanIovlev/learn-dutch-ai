# Test plan for Learn language app

version: 1.0.0
prepared by: Anisa
last update: 01/10/2025

## Introduction

Purpose: To validate the functionality of dutch language learning application

## Scope of testing

### In scope

    - functional testing with mocks: vocabulary, cards quiz, fill word form
    - unit testing
    - integration testing for UI components

### Out of scope

    - other functionality
    - performance
    - security
    - api

## Test objectives

Validate core functionality
Prevent regressions

## Testing approach & Techniques

Risk based, State Transition (SRS stages), Boundary Values, Test automation pyramid

## Test schedule

Run tests on feature branch before merge

## Test environment

Local machine, github actions

## Resources & Responsibility

Test planning, design, execution, reporting: Anisa.
Bug triage & fixes: Anisa.

## Risks & Mitigation

Shuffle returns random words, tasks for a user, mocks can help avoid unpreditability.
Using mocks doesn't allow to check connection API + DB in system tests, which can hide defects behind

## Test deliverables (Testware)

Test plan
Test cases
Automated test scenarios
Unit tests
Integration tests
Reports ?

## Entry & Exit criteria

Entry test mock data available
Exit no new critical defects found in main functionality

# Tools

unit, integration - jest, typescript
system - playwright, cypress, typescript

# Platform

mac os
out of scope: windows

# Browser

chrome, brave
out of scope: ie, edge, ff, safari
