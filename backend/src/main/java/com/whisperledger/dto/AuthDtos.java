package com.whisperledger.dto;

import com.whisperledger.entity.User;

public class AuthDtos {

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String department;
        private String year;
        private String password;
        private User.Role role;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getYear() { return year; }
        public void setYear(String year) { this.year = year; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    public static class AuthResponse {
        private String token;
        private String id;
        private String name;
        private String email;
        private String department;
        private String role;

        public AuthResponse(String token, String id, String name, String email, String department, String role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.department = department;
            this.role = role;
        }

        public String getToken() { return token; }
        public String getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getDepartment() { return department; }
        public String getRole() { return role; }
    }
}
